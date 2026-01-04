import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchCategories, setSearch, setCategory, setPage } from '../store/slices';
import { ProductCard } from '../components';

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
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Ürünler</h1>

                {/* Filters */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Ürün ara..."
                                className="input flex-1"
                            />
                            <button type="submit" className="btn-primary px-6">
                                Ara
                            </button>
                        </form>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className={`px-4 py-2 rounded-lg transition-colors ${!selectedCategory
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-light)]'
                                    }`}
                            >
                                Tümü
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                            ? 'bg-[var(--primary)] text-white'
                                            : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-light)]'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-[var(--text-muted)]">Ürün bulunamadı</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                <button
                                    onClick={() => dispatch(setPage(currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="btn-secondary px-4 py-2 disabled:opacity-50"
                                >
                                    Önceki
                                </button>
                                <span className="px-4 py-2 text-[var(--text-muted)]">
                                    Sayfa {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => dispatch(setPage(currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary px-4 py-2 disabled:opacity-50"
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
