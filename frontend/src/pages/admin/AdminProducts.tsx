import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProducts, deleteProduct } from '../../store/slices/productsSlice';
import ProductModal from '../../components/admin/ProductModal';
import type { Product } from '../../types';

const AdminProducts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) => state.auth.user?.role === 'ADMIN' ? state.products : { products: [], loading: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchProducts({}));
    }, [dispatch]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            await dispatch(deleteProduct(id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Ürün Yönetimi</h1>
                <button
                    onClick={handleCreate}
                    className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span>➕</span> Yeni Ürün Ekle
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 text-gray-300 text-sm uppercase">
                            <th className="px-6 py-4 font-semibold">Görsel</th>
                            <th className="px-6 py-4 font-semibold">Ürün Adı</th>
                            <th className="px-6 py-4 font-semibold">Fiyat</th>
                            <th className="px-6 py-4 font-semibold">Stok</th>
                            <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-6 py-4 text-gray-300">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {product.stock} Adet
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
                )}
                {!loading && products.length === 0 && (
                    <div className="p-8 text-center text-gray-400">Ürün bulunamadı.</div>
                )}
            </div>

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default AdminProducts;
