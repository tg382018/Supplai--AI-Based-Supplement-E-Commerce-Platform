import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { addProduct, updateProduct, fetchCategories } from '../../store/slices/productsSlice';
import { storageService } from '../../services';
import type { Product } from '../../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    tags: string;
    benefits: string;
    ingredients: string;
    usage: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state) => state.products);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(product?.imageUrl || null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
    } = useForm<ProductFormData>({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            stock: product?.stock || 0,
            categoryId: product?.categoryId || '',
            tags: product?.tags?.join(', ') || '',
            benefits: product?.benefits?.join(', ') || '',
            ingredients: product?.ingredients?.join(', ') || '',
            usage: product?.usage || '',
        },
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsUploading(true);
        try {
            let imageUrl = product?.imageUrl || '';

            if (imageFile) {
                const uploadResponse = await storageService.uploadFile(imageFile);
                imageUrl = uploadResponse.url;
            }

            const productData = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock),
                imageUrl,
                tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
                benefits: data.benefits.split(',').map((b) => b.trim()).filter(Boolean),
                ingredients: data.ingredients.split(',').map((i) => i.trim()).filter(Boolean),
            };

            if (product) {
                await dispatch(updateProduct({ id: product.id, data: productData }));
            } else {
                await dispatch(addProduct(productData));
            }
            onClose();
        } catch (error) {
            console.error('Save product error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-white">
                        {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✖
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Ürün Adı</label>
                                <input
                                    {...register('name', { required: 'Ad gerekli' })}
                                    className="input w-full"
                                    placeholder="Ürün adı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Kategori</label>
                                <select
                                    {...register('categoryId', { required: 'Kategori seçin' })}
                                    className="input w-full bg-slate-800"
                                >
                                    <option value="">Seçiniz</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Fiyat ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price', { required: 'Fiyat gerekli' })}
                                        className="input w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stok</label>
                                    <input
                                        type="number"
                                        {...register('stock', { required: 'Stok gerekli' })}
                                        className="input w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ürün Görseli</label>
                            <div className="relative group aspect-square rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden bg-slate-800/20">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-sm">Görseli Değiştir</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-gray-500 text-sm">Görsel Seç</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Açıklama</label>
                            <textarea
                                {...register('description')}
                                className="input w-full h-24"
                                placeholder="Ürün açıklaması..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Tags (Virgülle ayırın)</label>
                            <input
                                {...register('tags')}
                                className="input w-full"
                                placeholder="enerji, kas, whey"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Faydalar</label>
                                <textarea
                                    {...register('benefits')}
                                    className="input w-full h-20"
                                    placeholder="Kas yapımı, Hızlı emilim..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">İçerik</label>
                                <textarea
                                    {...register('ingredients')}
                                    className="input w-full h-20"
                                    placeholder="Protein, Amino asit..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Kullanım Talimatı</label>
                            <input
                                {...register('usage')}
                                className="input w-full"
                                placeholder="Günde 1 ölçek..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="flex-[2] btn-primary px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : null}
                            {product ? 'Güncelle' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
