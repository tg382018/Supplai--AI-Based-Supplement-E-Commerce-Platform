import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import { productService } from '../services';
import type { Product } from '../types';

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await productService.getProduct(id);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Ürün bulunamadı</h2>
                <button onClick={() => navigate('/products')} className="btn-secondary mt-4">
                    Ürünlere Dön
                </button>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white mb-8 flex items-center gap-2"
                >
                    ← Geri Dön
                </button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="glass-card p-4 aspect-square overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-9xl">💊</span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                                {product.category?.name}
                            </span>
                            <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
                        </div>

                        <div className="text-3xl font-bold text-primary">
                            ₺{product.price.toFixed(2)}
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-6 py-6 border-y border-white/10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center hover:bg-surface-light"
                                >
                                    -
                                </button>
                                <span className="text-xl font-bold w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center hover:bg-surface-light"
                                >
                                    +
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
                            </div>
                        </div>

                        <button
                            disabled={product.stock <= 0}
                            onClick={handleAddToCart}
                            className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3"
                        >
                            <span>🛒</span> Sepete Ekle
                        </button>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="glass-card p-4">
                                <span className="block text-gray-500 text-sm mb-1 uppercase tracking-wider">İçerik</span>
                                <div className="flex flex-wrap gap-1">
                                    {product.ingredients?.map((ing, i) => (
                                        <span key={i} className="text-sm bg-surface-light px-2 py-1 rounded">{ing}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-4">
                                <span className="block text-gray-500 text-sm mb-1 uppercase tracking-wider">Faydalar</span>
                                <div className="flex flex-wrap gap-1">
                                    {product.benefits?.map((ben, i) => (
                                        <span key={i} className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">{ben}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
