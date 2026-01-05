import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/slices/productsSlice';

const AdminCategories: React.FC = () => {
    const dispatch = useAppDispatch();
    const { categories, loading } = useAppSelector((state) => state.products);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await dispatch(addCategory({ name: newName.trim() }));
        setNewName('');
        setIsAdding(false);
    };

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setEditName(name);
    };

    const handleUpdate = async () => {
        if (!editingId || !editName.trim()) return;
        await dispatch(updateCategory({ id: editingId, data: { name: editName.trim() } }));
        setEditingId(null);
        setEditName('');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            await dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Kategori Yönetimi</h1>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        setEditingId(null);
                    }}
                    className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span>➕</span> {isAdding ? 'Vazgeç' : 'Yeni Kategori'}
                </button>
            </div>

            {isAdding && (
                <div className="glass-card p-6 flex gap-4 animate-fade-in">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Kategori adı..."
                        className="input flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        className="btn-primary px-6 rounded-lg font-semibold"
                    >
                        Ekle
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="glass-card p-6 space-y-4 group">
                        {editingId === category.id ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="input text-sm py-2"
                                    autoFocus
                                />
                                <div className="flex gap-2 text-xs">
                                    <button onClick={handleUpdate} className="text-primary font-bold">Kaydet</button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400">Vazgeç</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                    <p className="text-sm text-gray-400">Ürün Sayısı: {category._count?.products || 0}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category.id, category.name)}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {loading && <div className="text-center text-gray-400">Yükleniyor...</div>}
            {!loading && categories.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic">
                    Henüz kategori bulunmuyor.
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
