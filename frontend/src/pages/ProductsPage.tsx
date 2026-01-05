import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchCategories, setSearch, setCategory, setPage } from '../store/slices';
import { ProductCard } from '../components';
import {
    Search as SearchIcon,
    Filter,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    RefreshCw,
    ShoppingBag
} from 'lucide-react';

export const ProductsPage = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, categories, loading, search, selectedCategory, currentPage, totalPages } = useAppSelector(
        (state) => state.products
    );
    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            dispatch(setCategory(category));
        }
        dispatch(fetchCategories());
    }, [dispatch, searchParams]);

    useEffect(() => {
        dispatch(
            fetchProducts({
                search,
                categoryId: selectedCategory || undefined,
                page: currentPage,
            })
        );
    }, [dispatch, search, selectedCategory, currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearch(searchInput));
    };

    const handleCategoryChange = (categoryId: string | null) => {
        dispatch(setCategory(categoryId));
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="pt-12 pb-24 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-fade-up">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Mağaza</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Tüm Ürünler</h1>
                        <p className="text-gray-500 text-lg">Hangi hedefe ulaşmak istiyorsanız, ihtiyacınız olan en kaliteli supplementleri burada bulabilirsiniz.</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative group min-w-[320px]">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="İstediğiniz ürünü arayın..."
                            className="w-full bg-white text-gray-900 pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-emerald-50 transition-all outline-none shadow-sm shadow-gray-100"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </form>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-gray-400 font-bold text-xs uppercase tracking-widest mr-2">
                            <Filter className="w-4 h-4" /> Filtrele:
                        </div>
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${!selectedCategory
                                    ? 'bg-primary text-white shadow-lg shadow-emerald-100'
                                    : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedCategory === category.id
                                        ? 'bg-primary text-white shadow-lg shadow-emerald-100'
                                        : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100">
                        <LayoutGrid className="w-4 h-4" />
                        {products.length} Ürün Listeleniyor
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 animate-pulse">
                        <div className="w-16 h-16 border-4 border-emerald-50 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Yükleniyor...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[40px] border-4 border-dashed border-gray-50 animate-fade-up">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <SearchIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h2>
                        <p className="text-gray-500 mb-8">Aradığınız kriterlere uygun bir ürün bulamadık. Lütfen farklı anahtar kelimeler deneyin.</p>
                        <button
                            onClick={() => {
                                setSearchInput('');
                                dispatch(setSearch(''));
                                dispatch(setCategory(null));
                                setSearchParams({});
                            }}
                            className="btn-secondary"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Aramayı Sıfırla
                        </button>
                    </div>
                ) : (
                    <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-20">
                                <button
                                    onClick={() => dispatch(setPage(currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:border-emerald-200 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => dispatch(setPage(i + 1))}
                                            className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1
                                                    ? 'bg-primary text-white shadow-lg shadow-emerald-100'
                                                    : 'bg-white text-gray-400 border border-gray-100 hover:border-emerald-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => dispatch(setPage(currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:border-emerald-200 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
