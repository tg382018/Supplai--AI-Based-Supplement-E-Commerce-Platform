import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import type { Product } from '../types';
import { ShoppingCart, CheckCircle2, AlertTriangle, PackageSearch } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart({ product }));
    };

    return (
        <Link to={`/products/${product.id}`} className="card-premium h-full flex flex-col group">
            {/* Image Container */}
            <div className="product-image-container aspect-[4/5] bg-gray-50 relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-100">
                        <PackageSearch className="w-20 h-20 opacity-20" />
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur shadow-sm text-gray-900 border border-gray-100"
                        >
                            {tag.replace('_', ' ')}
                        </span>
                    ))}
                </div>

                {/* Stock Warning */}
                <div className="absolute top-4 right-4 z-10">
                    {product.stock < 5 && product.stock > 0 && (
                        <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg animate-pulse" title={`Son ${product.stock} adet!`}>
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                            YAKINDA
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="btn-primary transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        İncele
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                        {product.category?.name || 'GENEL'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {product.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 py-1 px-2.5 rounded-lg">
                            <CheckCircle2 className="w-3 h-3 text-primary/60" />
                            {benefit}
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fiyat</span>
                        <span className="text-2xl font-black text-gray-900">
                            ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`p-4 rounded-2xl transition-all duration-300 ${product.stock > 0
                                ? 'bg-emerald-50 text-primary hover:bg-primary hover:text-white shadow-lg shadow-emerald-100'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        title={product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                    >
                        <ShoppingCart className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Link>
    );
};
