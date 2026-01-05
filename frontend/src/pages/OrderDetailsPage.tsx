import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { clearCart } from '../store/slices';
import { orderService } from '../services';
import type { Order } from '../types';

export const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const isSuccess = searchParams.get('success') === 'true';

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearCart());
        }
    }, [isSuccess, dispatch]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const data = await orderService.getOrder(id);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Sipariş bulunamadı</h2>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {isSuccess && (
                    <div className="glass-card border-green-500/50 bg-green-500/10 p-8 text-center mb-8 animate-fade-in">
                        <div className="text-5xl mb-4">✅</div>
                        <h1 className="text-3xl font-bold text-green-400 mb-2">Siparişiniz Başarıyla Alındı!</h1>
                        <p className="text-gray-300">Ödemeniz onaylandı. Hazırlık sürecine başlıyoruz.</p>
                    </div>
                )}

                <div className="glass-card p-8 space-y-8">
                    <div className="flex justify-between items-start border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-xl font-bold">Sipariş No: #{order.id.slice(0, 8)}</h2>
                            <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                            {order.status === 'PAID' ? 'Ödendi' :
                                order.status === 'PENDING' ? 'Bekliyor' :
                                    order.status}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Ürünler</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded bg-surface flex items-center justify-center flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span>💊</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">{item.quantity} adet</p>
                                </div>
                                <p className="font-bold">₺{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-2">
                        <div className="flex justify-between text-gray-400">
                            <span>Ara Toplam</span>
                            <span>₺{order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Kargo</span>
                            <span className="text-green-500">Ücretsiz</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2">
                            <span>Toplam</span>
                            <span className="text-primary">₺{order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link to="/products" className="btn-secondary w-full py-3 block text-center">
                            Alışverişe Devam Et
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
