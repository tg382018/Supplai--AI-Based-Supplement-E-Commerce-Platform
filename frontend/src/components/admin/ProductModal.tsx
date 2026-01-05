import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Stack,
    Typography,
    MenuItem,
    Grid,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { addProduct, updateProduct, fetchCategories } from '../../store/slices/productsSlice';
import { storageService } from '../../services';
import type { Product } from '../../types';
import { X, Upload, Tag, History } from 'lucide-react';

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
    isActive: boolean;
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
        formState: { errors },
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
            isActive: product?.isActive ?? true,
        },
    });

    useEffect(() => {
        dispatch(fetchCategories({}));
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
                isActive: String(data.isActive) === 'true',
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

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    boxShadow: '0 40px 80px rgba(0,0,0,0.1)',
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: 'text.disabled' }}>
                    <X size={24} />
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ p: 4, py: 0 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Ürün Adı"
                                    placeholder="Ürün adı"
                                    {...register('name', { required: 'Ad gerekli' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                />

                                <TextField
                                    select
                                    fullWidth
                                    label="Kategori"
                                    {...register('categoryId', { required: 'Kategori seçin' })}
                                    error={!!errors.categoryId}
                                    helperText={errors.categoryId?.message}
                                    slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                >
                                    <MenuItem value="">Seçiniz</MenuItem>
                                    {categories.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </TextField>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Fiyat (₺)"
                                            {...register('price', { required: 'Fiyat gerekli' })}
                                            slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Stok"
                                            {...register('stock', { required: 'Stok gerekli' })}
                                            slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    select
                                    fullWidth
                                    label="Durum"
                                    {...register('isActive')}
                                    slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                >
                                    <MenuItem value="true">Aktif (Mağazada Görünür)</MenuItem>
                                    <MenuItem value="false">Pasif (Gizli)</MenuItem>
                                </TextField>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    borderRadius: 0,
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                    bgcolor: 'grey.50',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover .upload-overlay': { opacity: 1 }
                                }}
                            >
                                {previewUrl ? (
                                    <>
                                        <Box component="img" src={previewUrl} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 4 }} />
                                        <Box className="upload-overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', cursor: 'pointer' }}>
                                            <Upload size={32} />
                                            <Typography variant="caption" sx={{ mt: 1, fontWeight: 800 }}>Görseli Değiştir</Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <Stack spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}>
                                        <Upload size={48} />
                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>Görsel Seç</Typography>
                                    </Stack>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    accept="image/*"
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Açıklama"
                                    placeholder="Ürün açıklaması..."
                                    {...register('description')}
                                    slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                />

                                <TextField
                                    fullWidth
                                    label="Etiketler (Virgülle ayırın)"
                                    placeholder="enerji, kas, whey"
                                    {...register('tags')}
                                    slotProps={{
                                        input: {
                                            sx: { borderRadius: 3 },
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Tag size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            label="Faydalar"
                                            placeholder="Kas yapımı, Hızlı emilim..."
                                            {...register('benefits')}
                                            slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            label="İçerik"
                                            placeholder="Protein, Amino asit..."
                                            {...register('ingredients')}
                                            slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    label="Kullanım Talimatı"
                                    placeholder="Günde 1 ölçek..."
                                    {...register('usage')}
                                    slotProps={{
                                        input: {
                                            sx: { borderRadius: 3 },
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <History size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 4, pt: 3 }}>
                    <Button
                        onClick={onClose}
                        sx={{ fontWeight: 800, color: 'text.secondary', px: 3 }}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isUploading}
                        sx={{
                            px: 6,
                            py: 1.5,
                            borderRadius: 0,
                            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        {isUploading ? <CircularProgress size={24} color="inherit" /> : (product ? 'Güncelle' : 'Kaydet')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ProductModal;
