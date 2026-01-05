import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import { productService } from '../services';
import type { Product } from '../types';
import {
    ChevronLeft,
    ShoppingCart,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
    Sparkles,
    CheckCircle2,
    Info,
    PackageSearch
} from 'lucide-react';

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
            <div className="flex flex-col justify-center items-center h-screen bg-background">
                <div className="w-16 h-16 border-4 border-emerald-50 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Ürün Bilgileri Hesaplanıyor...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                    <PackageSearch className="w-10 h-10 text-gray-200" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Ürün Bulunamadı</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Aradığınız ürün sitemizde bulunmuyor veya kaldırılmış olabilir.</p>
                <button onClick={() => navigate('/products')} className="btn-secondary">
                    Mağazaya Dön
                </button>
            </div>
        );
    }

    return (
        <div className="pt-12 pb-24 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs / Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-all mb-12 animate-fade-up"
                >
                    <div className="p-2 bg-white border border-gray-100 rounded-xl group-hover:border-emerald-200 shadow-sm transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    GERİ DÖN
                </button>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Left: Product Media */}
                    <div className="lg:col-span-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        <div className="aspect-square bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden flex items-center justify-center p-12 group relative">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[32px] text-emerald-100">
                                    <PackageSearch className="w-32 h-32 opacity-20" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-lg border border-gray-100">
                                        {tag.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6 flex flex-col animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-emerald-50 text-primary text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em]">
                                    {product.category?.name || 'GENEL'}
                                </span>
                                {product.stock > 0 && product.stock < 10 && (
                                    <span className="bg-orange-50 text-orange-600 text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] animate-pulse">
                                        AZALAN STOK: {product.stock}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-5xl font-black text-gray-900">₺{product.price.toLocaleString('tr-TR')}</span>
                                <span className="text-gray-400 font-bold mb-1 uppercase tracking-widest text-xs">KDV Dahil</span>
                            </div>
                            <p className="text-gray-500 text-lg leading-relaxed mb-10 border-l-4 border-emerald-50 pl-6 italic">
                                "{product.description}"
                            </p>
                        </div>

                        {/* Inventory & CTA Section */}
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-100/30 mb-10">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex items-center bg-gray-50 p-2 rounded-3xl border border-gray-100 w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:text-primary hover:border-emerald-200 transition-all shadow-sm active:scale-95"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-16 text-center text-xl font-black text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:text-primary hover:border-emerald-200 transition-all shadow-sm active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    disabled={product.stock <= 0}
                                    onClick={handleAddToCart}
                                    className="flex-1 w-full btn-primary py-5 rounded-[24px] text-lg font-black flex items-center justify-center gap-4 group shadow-2xl shadow-emerald-100"
                                >
                                    <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    {product.stock > 0 ? 'SEPETE EKLE' : 'STOKTA YOK'}
                                </button>
                            </div>
                        </div>

                        {/* Features / Benefits Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-secondary/10 rounded-xl">
                                        <Sparkles className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight">Kazanımlar</h4>
                                </div>
                                <div className="space-y-3">
                                    {product.benefits?.map((ben, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            {ben}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Info className="w-5 h-5 text-primary" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight">İçerikler</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.ingredients?.map((ing, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-500">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-10">
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheck className="w-8 h-8 text-emerald-300 mb-3" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GÜVENLİ ÖDEME</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Truck className="w-8 h-8 text-emerald-300 mb-3" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">HIZLI KARGO</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RefreshCw className="w-8 h-8 text-emerald-300 mb-3" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KOLAY İADE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
