import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices';
import { orderService } from '../services';
import { useState } from 'react';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    ShieldCheck,
    Truck,
    RefreshCw,
    PackageSearch
} from 'lucide-react';

export const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, total } = useAppSelector((state) => state.cart);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const order = await orderService.createOrder(orderData);
            const checkout = await orderService.checkout(order.id);

            if (checkout.url) {
                window.location.href = checkout.url;
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="pt-24 pb-48 min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="max-w-md w-full px-6 text-center animate-fade-up">
                    <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                        <PackageSearch className="w-12 h-12 text-gray-200" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Sepetiniz Boş</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed text-lg">
                        Görünüşe göre henüz sepetinize bir ürün eklememişsiniz. En iyi ürünlerimizi keşfetmeye ne dersiniz?
                    </p>
                    <Link to="/products" className="btn-primary inline-flex items-center gap-2 group w-full py-4 justify-center shadow-xl shadow-emerald-100">
                        <ShoppingBag className="w-5 h-5" />
                        Alışverişe Başla
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-12 pb-24 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end gap-4 mb-12 animate-fade-up">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <span className="text-sm font-black text-primary uppercase tracking-widest">Siparişiniz</span>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Sepetim</h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Cart Items Area */}
                    <div className="lg:col-span-8 space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">{items.length} Ürün</h2>
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Sepeti Temizle
                            </button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="bg-white rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all group">
                                    {/* Image Container */}
                                    <Link to={`/products/${item.product.id}`} className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                                        {item.product.imageUrl ? (
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-100">
                                                <PackageSearch className="w-12 h-12" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details Area */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
                                                        {item.product.category?.name || 'GENEL'}
                                                    </span>
                                                    <Link
                                                        to={`/products/${item.product.id}`}
                                                        className="text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-black text-gray-900">₺{item.product.price.toLocaleString('tr-TR')}</span>
                                                    <p className="text-xs text-gray-400 mt-1">Birim Fiyat</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:text-primary hover:border-emerald-200 transition-all shadow-sm active:scale-90"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:text-primary hover:border-emerald-200 transition-all shadow-sm active:scale-90"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Action Buttons */}
                                            <button
                                                onClick={() => dispatch(removeFromCart(item.product.id))}
                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Ürünü Kaldır"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 p-10 h-fit sticky top-28">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-tight">Sipariş Özeti</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Ara Toplam</span>
                                    <span className="text-lg font-bold text-gray-900">₺{total.toLocaleString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Tahmini Kargo</span>
                                    <span className="text-primary font-black uppercase text-xs tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg">Ücretsiz</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">Toplam</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-primary">₺{total.toLocaleString('tr-TR')}</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">KDV DAHİL</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 group"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        Ödemeye Geç
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {!isAuthenticated && (
                                <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                    <p className="text-xs font-bold text-orange-800 leading-relaxed uppercase tracking-wider">
                                        Ödeme yapmak için <Link to="/login" className="text-primary hover:underline">Giriş Yapılmalı</Link>
                                    </p>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                                    <ShieldCheck className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Güvenli Ödeme</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                                    <Truck className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hızlı Kargo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
