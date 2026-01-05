import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    Chip,
    Paper,
    Avatar,
    TextField,
    InputAdornment,
    Pagination,
    CircularProgress
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchCategories, setSearch, setCategory, setPage } from '../store/slices';
import {
    ProductCard,
    Footer
} from '../components';
import {
    CheckCircle2,
    Search as SearchIcon,
    Filter,
    LayoutGrid,
    RefreshCw,
    Sparkles,
    Zap,
    ShieldCheck,
    Truck,
    ShoppingBag
} from 'lucide-react';

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { products, categories, loading, search, selectedCategory, currentPage, totalPages } = useAppSelector(
        (state) => state.products
    );
    const [searchInput, setSearchInput] = useState(search || '');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

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
        // We don't use searchParams on Home unless we want to, 
        // but for now let's keep it clean or just dispatch.
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(setPage(value));
        const productsElement = document.getElementById('all-products-section');
        if (productsElement) {
            productsElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                component="section"
                sx={{
                    position: 'relative',
                    minHeight: '85vh',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    bgcolor: 'white',
                    py: { xs: 8, md: 0 }
                }}
            >
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    opacity: 0.1,
                    pointerEvents: 'none'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        filter: 'blur(100px)'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: -100,
                        width: 320,
                        height: 320,
                        bgcolor: 'secondary.main',
                        borderRadius: '50%',
                        filter: 'blur(80px)'
                    }} />
                </Box>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box sx={{ animation: 'fade-up 0.6s ease-out' }}>
                                <Chip
                                    icon={<Sparkles size={16} />}
                                    label="Yeni Nesil Supplement Deneyimi"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        mb: 4,
                                        fontWeight: 800,
                                        bgcolor: 'emerald.50',
                                        borderColor: 'primary.light',
                                        px: 1
                                    }}
                                />
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '3rem', md: '4.5rem' },
                                        color: 'text.primary',
                                        mb: 4,
                                        lineHeight: 1.1
                                    }}
                                >
                                    Sağlığınız İçin <br />
                                    <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>Zeki</Box> Seçimler
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mb: 6, fontWeight: 500, lineHeight: 1.6, maxWidth: 500 }}
                                >
                                    AI asistanımız hedeflerinizi anlar, vücudunuzun ihtiyaç duyduğu en doğru takviyeleri saniyeler içinde size özel olarak seçer.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                    <Button
                                        component={RouterLink}
                                        to="/ai-advisor"
                                        variant="contained"
                                        size="large"
                                        endIcon={<Zap size={20} />}
                                        sx={{
                                            px: 5,
                                            py: 2,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        AI Danışmana Sor
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/products"
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                        sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
                                    >
                                        Mağazayı Gez
                                    </Button>
                                </Stack>

                                <Stack direction="row" spacing={4} sx={{ mt: 8, opacity: 0.5 }}>
                                    {['Lab Onaylı', '%100 Doğal', 'GMP Sertifikalı'].map(text => (
                                        <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle2 size={18} />
                                            <Typography variant="caption" sx={{ fontWeight: 800 }}>{text}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Box sx={{ position: 'relative' }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '8px solid white',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                        sx={{ width: '100%', height: 600, objectFit: 'cover' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 24,
                                        left: 24,
                                        right: 24,
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(20px)',
                                        p: 3,
                                        borderRadius: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2 }}>
                                            <ShieldCheck color="white" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Güvenilir İçerik</Typography>
                                            <Typography variant="caption" color="text.secondary">Tüm ürünlerimiz test edilmiş ve onaylanmıştır.</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>





            {/* All Products Section (Replaces Featured) */}
            <Box id="all-products-section" component="section" sx={{ py: { xs: 12, md: 16 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    {/* Header & Search */}
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ md: 'flex-end' }}
                        justifyContent="space-between"
                        spacing={4}
                        sx={{ mb: 8 }}
                    >
                        <Box sx={{ maxWidth: 600 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: 'emerald.50', borderRadius: 2, display: 'flex' }}>
                                    <ShoppingBag size={24} color="#10b981" />
                                </Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                                    KEŞFEDİN
                                </Typography>
                            </Stack>
                            <Typography variant="h2" sx={{ mb: 2 }}>Tüm Ürünlerimiz</Typography>
                            <Typography variant="h6" color="text.secondary">
                                İhtiyacınız olan en kaliteli supplementleri filtreleyerek hemen bulun.
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSearch} sx={{ width: { xs: '100%', md: 400 } }}>
                            <TextField
                                fullWidth
                                placeholder="Ürün ara..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon size={20} color="#94a3b8" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 4,
                                        bgcolor: 'white',
                                        '& fieldset': { borderColor: 'grey.100' },
                                        '&:hover fieldset': { borderColor: 'primary.light' },
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }
                                }}
                            />
                        </Box>
                    </Stack>

                    {/* Filters */}
                    <Stack
                        direction={{ xs: 'column', lg: 'row' }}
                        alignItems={{ lg: 'center' }}
                        justifyContent="space-between"
                        spacing={4}
                        sx={{ mb: 6 }}
                    >
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                            <Paper
                                sx={{
                                    px: 2,
                                    py: 1,
                                    bgcolor: 'white',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Filter size={16} color="#94a3b8" />
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>
                                    FİLTRELE:
                                </Typography>
                            </Paper>

                            <Button
                                variant={!selectedCategory ? 'contained' : 'outlined'}
                                onClick={() => handleCategoryChange(null)}
                                sx={{
                                    borderRadius: 2.5,
                                    px: 3,
                                    fontWeight: 800,
                                    boxShadow: !selectedCategory ? '0 10px 15px -3px rgba(16, 185, 129, 0.2)' : 'none'
                                }}
                            >
                                Tümü
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                                    onClick={() => handleCategoryChange(category.id)}
                                    sx={{
                                        borderRadius: 2.5,
                                        px: 3,
                                        fontWeight: 800,
                                        boxShadow: selectedCategory === category.id ? '0 10px 15px -3px rgba(16, 185, 129, 0.2)' : 'none'
                                    }}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </Stack>

                        <Paper
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2.5,
                                py: 1,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'white'
                            }}
                        >
                            <LayoutGrid size={16} color="#94a3b8" />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                                {products.length} Ürün
                            </Typography>
                        </Paper>
                    </Stack>

                    {/* Content */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 15 }}>
                            <CircularProgress size={50} thickness={4} color="primary" />
                        </Box>
                    ) : products.length === 0 ? (
                        <Paper
                            variant="outlined"
                            sx={{
                                textAlign: 'center',
                                py: 10,
                                borderRadius: 8,
                                borderStyle: 'dashed',
                                borderWidth: 3,
                                bgcolor: 'white'
                            }}
                        >
                            <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.50', mx: 'auto', mb: 2, color: 'grey.300' }}>
                                <SearchIcon size={30} />
                            </Avatar>
                            <Typography variant="h5" sx={{ mb: 1 }}>Ürün Bulunamadı</Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<RefreshCw size={16} />}
                                onClick={() => {
                                    setSearchInput('');
                                    dispatch(setSearch(''));
                                    dispatch(setCategory(null));
                                }}
                                sx={{ borderRadius: 3, mt: 2, fontWeight: 800 }}
                            >
                                Sıfırla
                            </Button>
                        </Paper>
                    ) : (
                        <Box>
                            <Grid container spacing={3}>
                                {products.map((product) => (
                                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={product.id}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                borderRadius: 3,
                                                fontWeight: 900,
                                                height: 48,
                                                minWidth: 48,
                                                bgcolor: 'white',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>



            {/* Footer */}
            <Footer />
        </Box>
    );
};
