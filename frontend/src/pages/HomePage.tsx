import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchFeatured, fetchCategories } from '../store/slices';
import { ProductCard } from '../components';
import {
    Zap,
    ShieldCheck,
    Truck,
    ArrowRight,
    Sparkles,
    ShoppingBag,
    CheckCircle2
} from 'lucide-react';

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { featured, categories } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchFeatured());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary rounded-full blur-[80px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-primary text-sm font-bold mb-6 border border-emerald-100">
                                <Sparkles className="w-4 h-4" />
                                <span>Yeni Nesil Supplement Deneyimi</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900 leading-[1.1] tracking-tight">
                                Sağlığınız İçin <br />
                                <span className="text-primary italic">Zeki</span> Seçimler
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                                AI asistanımız hedeflerinizi anlar, vücudunuzun ihtiyaç duyduğu en doğru takviyeleri saniyeler içinde size özel olarak seçer.
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <Link to="/ai-advisor" className="btn-primary text-lg px-10 py-5 shadow-2xl shadow-emerald-200">
                                    AI Danışmana Sor
                                    <Zap className="w-5 h-5 fill-current" />
                                </Link>
                                <Link to="/products" className="btn-secondary text-lg px-10 py-5">
                                    Mağazayı Gez
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                                <div className="flex items-center gap-2 font-bold text-gray-400">
                                    <CheckCircle2 className="w-5 h-5" /> Lab Onaylı
                                </div>
                                <div className="flex items-center gap-2 font-bold text-gray-400">
                                    <CheckCircle2 className="w-5 h-5" /> %100 Doğal
                                </div>
                                <div className="flex items-center gap-2 font-bold text-gray-400">
                                    <CheckCircle2 className="w-5 h-5" /> GMP Sertifikalı
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative animate-slide-right">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Healthy Lifestyle"
                                    className="w-full h-[600px] object-cover"
                                />
                                <div className="absolute bottom-6 left-6 right-6 glass-light p-6 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary p-3 rounded-xl shadow-lg">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Güvenilir İçerik</h4>
                                            <p className="text-sm text-gray-500">Tüm ürünlerimiz test edilmiş ve onaylanmıştır.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl animate-float z-20">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-black text-primary">4.9</span>
                                    <div className="flex gap-1 my-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kullanıcı Puanı</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-32 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Neden Supplai'ı Seçmelisiniz?</h2>
                        <p className="text-gray-500 text-lg">Supplement dünyasında kaybolmayın. Bilim ve yapay zeka ile size en doğru yolu gösteriyoruz.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Zap className="w-10 h-10 text-primary" />,
                                title: 'AI Destekli Analiz',
                                desc: 'Gelişmiş algoritmalarımız vücut tipiniz ve hedeflerinize göre en verimli kombinasyonları oluşturur.',
                                color: 'bg-emerald-50'
                            },
                            {
                                icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
                                title: 'Üstün Kalite',
                                desc: 'Dünyanın en güvenilir markaları ve laboratuvar onaylı içerikler ile sağlığınızı koruyoruz.',
                                color: 'bg-blue-50'
                            },
                            {
                                icon: <Truck className="w-10 h-10 text-coral-500" />,
                                title: 'Ekspres Teslimat',
                                desc: 'Eksik takviyeleriniz için beklemenize gerek yok. Aynı gün kargo ve hızlı teslimat avantajı.',
                                color: 'bg-orange-50'
                            },
                        ].map((feature, index) => (
                            <div key={index} className="card-premium p-10 group hover:bg-white animate-fade-up" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">Kategorilere Göre Keşfedin</h2>
                                <p className="text-gray-500">Sağlık yolculuğunuzda ihtiyacınız olan her şey kategorilere ayrılmış şekilde burada.</p>
                            </div>
                            <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                Tümünü İncele <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.id}`}
                                    className="group relative h-64 rounded-3xl overflow-hidden bg-gray-100 border border-gray-100"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                    {category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <ShoppingBag className="w-12 h-12 text-primary opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                        <p className="text-white/70 text-sm font-medium">
                                            {category._count?.products || 0} Ürün Listeleniyor
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="py-32 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-fade-up">
                            <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Popüler Seçimler</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">Öne Çıkan Supplementler</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featured.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-[40px] overflow-hidden bg-gray-900 py-24 px-10 text-center">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] -rotate-12 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-emerald-500/10 blur-[100px] translate-y-1/2" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="inline-flex p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
                                <Zap className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                                Size En Uygun Takviyeyi <br />
                                <span className="text-primary">Birlikte Bulalım</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                                AI asistanımıza boy, kilo and hedeflerinizi anlatın, size saniyeler içinde bilimsel temelli öneriler sunsun. Kullanmaya başlamak tamamen ücretsizdir.
                            </p>
                            <Link to="/ai-advisor" className="btn-primary text-xl px-12 py-6 shadow-2xl shadow-emerald-900/40">
                                🤖 Hemen AI Asistanı Başlat
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-gray-900">Supp<span className="text-primary">lai</span></span>
                        </Link>
                        <div className="flex gap-10 text-sm font-bold text-gray-500 uppercase tracking-widest">
                            <Link to="/products" className="hover:text-primary transition-colors">Mağaza</Link>
                            <Link to="/ai-advisor" className="hover:text-primary transition-colors">AI Asistan</Link>
                            <Link target="_blank" to="#" className="hover:text-primary transition-colors">Instagram</Link>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                            © 2026 Supplai Health. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
