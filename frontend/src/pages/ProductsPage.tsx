import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    TextField,
    InputAdornment,
    Button,
    Pagination,
    CircularProgress,
    Paper,
    Fade,
    Avatar
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchCategories, setSearch, setCategory, setPage } from '../store/slices';
import { ProductCard, Footer } from '../components';
import {
    Search as SearchIcon,
    Filter,
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

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(setPage(value));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="lg">
                <Fade in timeout={600}>
                    <Box>
                        {/* Page Header */}
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
                                        Mağaza
                                    </Typography>
                                </Stack>
                                <Typography variant="h2" sx={{ mb: 2 }}>Tüm Ürünler</Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Hangi hedefe ulaşmak istiyorsanız, ihtiyacınız olan en kaliteli supplementleri burada bulabilirsiniz.
                                </Typography>
                            </Box>

                            {/* Search Bar */}
                            <Box component="form" onSubmit={handleSearch} sx={{ width: { xs: '100%', md: 400 } }}>
                                <TextField
                                    fullWidth
                                    placeholder="İstediğiniz ürünü arayın..."
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
                            sx={{ mb: 8 }}
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
                                    {products.length} Ürün Listeleniyor
                                </Typography>
                            </Paper>
                        </Stack>

                        {/* Products Content */}
                        {loading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
                                <CircularProgress size={60} thickness={4} color="primary" />
                                <Typography variant="overline" sx={{ mt: 3, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.2em' }}>
                                    Yükleniyor...
                                </Typography>
                            </Box>
                        ) : products.length === 0 ? (
                            <Paper
                                variant="outlined"
                                sx={{
                                    textAlign: 'center',
                                    py: 12,
                                    borderRadius: 10,
                                    borderStyle: 'dashed',
                                    borderWidth: 4,
                                    bgcolor: 'white'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'grey.50',
                                        mx: 'auto',
                                        mb: 3,
                                        color: 'grey.300'
                                    }}
                                >
                                    <SearchIcon size={40} />
                                </Avatar>
                                <Typography variant="h4" sx={{ mb: 2 }}>Ürün Bulunamadı</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                                    Aradığınız kriterlere uygun bir ürün bulamadık. Lütfen farklı anahtar kelimeler deneyin.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<RefreshCw size={18} />}
                                    onClick={() => {
                                        setSearchInput('');
                                        dispatch(setSearch(''));
                                        dispatch(setCategory(null));
                                        setSearchParams({});
                                    }}
                                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}
                                >
                                    Aramayı Sıfırla
                                </Button>
                            </Paper>
                        ) : (
                            <Box>
                                <Grid container spacing={4}>
                                    {products.map((product) => (
                                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={product.id}>
                                            <ProductCard product={product} />
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    borderRadius: 4,
                                                    fontWeight: 900,
                                                    height: 48,
                                                    minWidth: 48,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'white'
                                                },
                                                '& .Mui-selected': {
                                                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
