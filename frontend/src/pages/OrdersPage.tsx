import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services';
import type { Order } from '../types';

export const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="pt-8 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Siparişlerim</h1>

                {orders.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-semibold mb-4">Henüz siparişiniz bulunmuyor</h2>
                        <Link to="/products" className="btn-primary">Alışverişe Başla</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 hover:border-primary/50 transition-colors"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Sipariş No</p>
                                    <p className="font-mono font-bold">#{order.id.slice(0, 8)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Tarih</p>
                                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Toplam</p>
                                    <p className="font-bold text-primary">₺{order.total.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">Durum</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {order.status === 'PAID' ? 'Ödendi' :
                                            order.status === 'PENDING' ? 'Bekliyor' :
                                                order.status}
                                    </span>
                                </div>
                                <div className="text-primary">
                                    Detaylar →
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
