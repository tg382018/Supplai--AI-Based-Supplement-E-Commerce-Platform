import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices';
import { orderService } from '../services';
import { useState } from 'react';

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
            <div className="pt-24 pb-12 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="glass-card p-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
                        <p className="text-[var(--text-muted)] mb-8">
                            Henüz sepetinize ürün eklemediniz.
                        </p>
                        <Link to="/products" className="btn-primary">
                            Ürünleri Keşfet
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Sepetim</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="glass-card p-4 flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">
                                            💊
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <Link
                                        to={`/products/${item.product.id}`}
                                        className="font-semibold hover:text-[var(--primary)] transition-colors"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {item.product.category?.name}
                                    </p>
                                    <p className="text-[var(--primary)] font-bold mt-2">
                                        ₺{item.product.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                updateQuantity({
                                                    productId: item.product.id,
                                                    quantity: item.quantity - 1,
                                                })
                                            )
                                        }
                                        className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--surface-light)] transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                updateQuantity({
                                                    productId: item.product.id,
                                                    quantity: item.quantity + 1,
                                                })
                                            )
                                        }
                                        className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--surface-light)] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => dispatch(removeFromCart(item.product.id))}
                                    className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="text-sm text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                        >
                            Sepeti Temizle
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="glass-card p-6 h-fit sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Ara Toplam</span>
                                <span>₺{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Kargo</span>
                                <span className="text-[var(--success)]">Ücretsiz</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                                <span>Toplam</span>
                                <span className="text-[var(--primary)]">₺{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="btn-primary w-full py-3"
                        >
                            {loading ? 'İşleniyor...' : 'Ödemeye Geç'}
                        </button>

                        {!isAuthenticated && (
                            <p className="text-sm text-[var(--text-muted)] text-center mt-4">
                                Ödeme için{' '}
                                <Link to="/login" className="text-[var(--primary)]">
                                    giriş yapmanız
                                </Link>{' '}
                                gerekiyor
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
