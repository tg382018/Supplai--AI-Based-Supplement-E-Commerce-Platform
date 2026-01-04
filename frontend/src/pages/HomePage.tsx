import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchFeatured, fetchCategories } from '../store/slices';
import { ProductCard } from '../components';

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { featured, categories } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchFeatured());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary)]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-3xl animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">AI Destekli</span>
                            <br />
                            Supplement Önerileri
                        </h1>
                        <p className="text-xl text-[var(--text-muted)] mb-8 leading-relaxed">
                            Sağlık hedeflerinize ulaşmanız için yapay zeka destekli kişiselleştirilmiş supplement önerileri.
                            Hedeflerinizi anlatın, size en uygun ürünleri önerelim.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/ai-advisor" className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
                                🤖 AI Asistan ile Başla
                            </Link>
                            <Link to="/products" className="btn-secondary text-lg px-8 py-4">
                                Tüm Ürünleri Gör
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Neden Supplai?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🤖', title: 'AI Destekli Öneriler', desc: 'Yapay zeka ile kişiselleştirilmiş supplement önerileri alın.' },
                            { icon: '✅', title: 'Kaliteli Ürünler', desc: 'Titizlikle seçilmiş, kalite kontrollü supplement ürünleri.' },
                            { icon: '🚀', title: 'Hızlı Teslimat', desc: 'Türkiye genelinde hızlı ve güvenli kargo.' },
                        ].map((feature, index) => (
                            <div key={index} className="glass-card p-8 text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-[var(--text-muted)]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-20 bg-[var(--surface)]/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Kategoriler</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.id}`}
                                    className="glass-card p-6 text-center hover:border-[var(--primary)] transition-colors"
                                >
                                    <h3 className="font-semibold mb-1">{category.name}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {category._count?.products || 0} ürün
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
                            <Link to="/products" className="text-[var(--primary)] hover:underline">
                                Tümünü Gör →
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featured.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Size Özel Supplement Önerileri İster misiniz?
                            </h2>
                            <p className="text-xl text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
                                AI asistanımıza hedeflerinizi anlatın, size en uygun ürünleri önerelim.
                            </p>
                            <Link to="/ai-advisor" className="btn-primary text-lg px-8 py-4">
                                🤖 AI Asistan ile Konuş
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">💊</span>
                            <span className="text-xl font-bold gradient-text">Supplai</span>
                        </div>
                        <p className="text-[var(--text-muted)] text-sm">
                            © 2026 Supplai. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
