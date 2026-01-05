import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Stack,
    TextField,
    IconButton,
    Avatar,
    CircularProgress,
    Fade,
    Tooltip,
    InputAdornment
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/slices/productsSlice';
import { Plus, Pencil, Trash2, Tag, Save, X, Package, Layers } from 'lucide-react';

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
        <Box sx={{ animate: 'fade-in 0.5s ease' }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Kategori Yönetimi</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Ürün kategorilerini oluşturun, düzenleyin ve ürün dağılımını kontrol edin.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color={isAdding ? "inherit" : "primary"}
                    startIcon={isAdding ? <X size={20} /> : <Plus size={20} />}
                    onClick={() => {
                        setIsAdding(!isAdding);
                        setEditingId(null);
                    }}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 0,
                        boxShadow: isAdding ? 'none' : '0 10px 20px rgba(16, 185, 129, 0.2)',
                        fontWeight: 800,
                        textTransform: 'none'
                    }}
                >
                    {isAdding ? 'Vazgeç' : 'Yeni Kategori'}
                </Button>
            </Box>

            {isAdding && (
                <Fade in timeout={400}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 6,
                            borderRadius: 0,
                            border: '1px solid',
                            borderColor: 'primary.light',
                            bgcolor: 'emerald.50/50',
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Kategori adı ekleyin (örn: Protein Tozu, Vitaminler...)"
                            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                            slotProps={{
                                input: {
                                    sx: { borderRadius: 0, bgcolor: 'white' },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Tag size={18} color="#10b981" />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            disabled={!newName.trim()}
                            sx={{ borderRadius: 0, px: 4, fontWeight: 800 }}
                        >
                            Ekle
                        </Button>
                    </Paper>
                </Fade>
            )}

            <Grid container spacing={4}>
                {categories.map((category, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={category.id}>
                        <Fade in timeout={400 + (index * 100)}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 0,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', borderColor: 'primary.light' }
                                }}
                            >
                                {editingId === category.id ? (
                                    <Stack spacing={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                            slotProps={{ input: { sx: { borderRadius: 0 } } }}
                                        />
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleUpdate}
                                                startIcon={<Save size={14} />}
                                                sx={{ borderRadius: 0, fontWeight: 800 }}
                                            >
                                                Kaydet
                                            </Button>
                                            <Button
                                                variant="text"
                                                size="small"
                                                color="inherit"
                                                onClick={() => setEditingId(null)}
                                                sx={{ borderRadius: 0, fontWeight: 800 }}
                                            >
                                                Vazgeç
                                            </Button>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                                            <Avatar sx={{ bgcolor: 'emerald.50', color: 'primary.main', borderRadius: 0 }}>
                                                <Layers size={22} />
                                            </Avatar>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="Düzenle">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(category.id, category.name)}
                                                        sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'emerald.50' } }}
                                                    >
                                                        <Pencil size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Sil">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(category.id)}
                                                        sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'error.50' } }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{category.name}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Package size={14} color="#94a3b8" />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                                                {category._count?.products || 0} ÜRÜN MEVCUT
                                            </Typography>
                                        </Stack>
                                    </Box>
                                )}
                            </Paper>
                        </Fade>
                    </Grid>
                ))}
            </Grid>

            {loading && (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                    <CircularProgress size={32} thickness={4} />
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, fontWeight: 900, color: 'text.secondary' }}>YÜKLENİYOR...</Typography>
                </Box>
            )}
            {!loading && categories.length === 0 && (
                <Box sx={{ p: 12, textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mx: 'auto', mb: 3 }}>
                        <Tag size={40} color="#cbd5e1" />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Kategori Bulunamadı</Typography>
                    <Typography variant="body2" color="text.disabled">Henüz herhangi bir ürün kategorisi oluşturmadınız.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default AdminCategories;
