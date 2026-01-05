import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Avatar,
    Chip,
    CircularProgress,
    Fade,
    Stack,
    Tooltip
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProducts, deleteProduct } from '../../store/slices/productsSlice';
import ProductModal from '../../components/admin/ProductModal';
import type { Product } from '../../types';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const AdminProducts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) =>
        state.auth.user?.role === 'ADMIN' ? state.products : { products: [], loading: false }
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchProducts({ includeInactive: true }));
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
        <Box sx={{ animate: 'fade-in 0.5s ease' }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Ürün Yönetimi</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Mağazanızdaki ürünleri listeleyin, düzenleyin veya yenilerini ekleyin.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={handleCreate}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 0,
                        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
                        fontWeight: 800
                    }}
                >
                    Yeni Ürün Ekle
                </Button>
            </Box>

            <Fade in timeout={800}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Görsel</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Ürün Adı</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Fiyat</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Stok</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Durum</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', textAlign: 'right' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow
                                    key={product.id}
                                    sx={{ '&:hover': { bgcolor: 'grey.50/50' }, transition: 'background-color 0.2s', opacity: product.isActive ? 1 : 0.6 }}
                                >
                                    <TableCell>
                                        <Avatar
                                            src={product.imageUrl || ''}
                                            variant="rounded"
                                            sx={{ width: 48, height: 48, bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider' }}
                                        >
                                            <Package size={24} color="#94a3b8" />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{product.name}</Typography>
                                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>#{product.id.slice(0, 8)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>₺{product.price.toLocaleString('tr-TR')}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${product.stock} Adet`}
                                            size="small"
                                            color={product.stock > 10 ? 'success' : 'error'}
                                            sx={{ fontWeight: 900, fontSize: '0.7rem', height: 24 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.isActive ? 'Aktif' : 'Pasif'}
                                            size="small"
                                            variant={product.isActive ? 'filled' : 'outlined'}
                                            color={product.isActive ? 'success' : 'default'}
                                            sx={{ fontWeight: 900, fontSize: '0.7rem', height: 24 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Düzenle">
                                                <IconButton
                                                    onClick={() => handleEdit(product)}
                                                    sx={{ color: 'primary.main', bgcolor: 'emerald.50', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                                                >
                                                    <Pencil size={18} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sil">
                                                <IconButton
                                                    onClick={() => handleDelete(product.id)}
                                                    sx={{ color: 'error.main', bgcolor: 'error.50', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                                                >
                                                    <Trash2 size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {loading && (
                        <Box sx={{ p: 8, textAlign: 'center' }}>
                            <CircularProgress size={32} thickness={4} />
                            <Typography variant="caption" sx={{ display: 'block', mt: 2, fontWeight: 900, color: 'text.secondary' }}>YÜKLENİYOR...</Typography>
                        </Box>
                    )}
                    {!loading && products.length === 0 && (
                        <Box sx={{ p: 12, textAlign: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mx: 'auto', mb: 3 }}>
                                <Package size={40} color="#cbd5e1" />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Ürün Bulunamadı</Typography>
                            <Typography variant="body2" color="text.disabled">Henüz mağazanıza herhangi bir ürün eklemediniz.</Typography>
                        </Box>
                    )}
                </TableContainer>
            </Fade>

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </Box>
    );
};

export default AdminProducts;
