import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart(product));
    };

    return (
        <Link to={`/products/${product.id}`} className="glass-card overflow-hidden group">
            {/* Image */}
            <div className="aspect-square bg-[var(--surface)] relative overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
                        💊
                    </div>
                )}

                {/* Tags */}
                {product.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2 py-1 rounded-full bg-[var(--primary)]/80 text-white"
                            >
                                {tag.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stock Badge */}
                {product.stock < 5 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-[var(--accent)]/80 text-white">
                        Son {product.stock} adet
                    </span>
                )}
                {product.stock === 0 && (
                    <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-[var(--error)]/80 text-white">
                        Stokta yok
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="text-xs text-[var(--text-muted)] mb-1">
                    {product.category?.name}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Benefits */}
                {product.benefits.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {product.benefits.slice(0, 2).map((benefit, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-2 py-1 rounded-full bg-[var(--surface-light)] text-[var(--text-muted)]"
                                >
                                    ✓ {benefit}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--primary)]">
                        ₺{product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                    </button>
                </div>
            </div>
        </Link>
    );
};
