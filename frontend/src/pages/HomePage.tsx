import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
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
    Footer,
    HeroSlider
} from '../components';
import {
    Search as SearchIcon,
    Filter,
    LayoutGrid,
    RefreshCw,
    ShoppingBag
} from 'lucide-react';

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { products, categories, loading, search, selectedCategory, currentPage, totalPages } = useAppSelector(
        (state) => state.products
    );
    const [searchInput, setSearchInput] = useState(''); // Changed initial state to empty string
    const [searchParams] = useSearchParams(); // Added useSearchParams hook

    useEffect(() => {
        // Clear search when entering homepage
        dispatch(setSearch(''));
        setSearchInput('');

        const category = searchParams.get('category');
        if (category) {
            dispatch(setCategory(category));
        } else {
            // Reset category if not in URL (important fix for "Tümü" filter)
            dispatch(setCategory(null));
        }
        dispatch(fetchCategories({}));
    }, [dispatch, searchParams]);

    useEffect(() => {
        // Race condition fix:
        // If searchInput is empty (meaning we are on fresh homepage)
        // BUT search (redux state) is NOT empty (meaning it hasn't been reset yet),
        // we SKIP this fetch to avoid showing stale search results.
        if (searchInput === '' && search !== '') {
            return;
        }

        dispatch(
            fetchProducts({
                search,
                categoryId: selectedCategory || undefined,
                page: currentPage,
            })
        );
    }, [dispatch, search, selectedCategory, currentPage, searchInput]);

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
            {/* Hero Slider */}
            <HeroSlider />





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
