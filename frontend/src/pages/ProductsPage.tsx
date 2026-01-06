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
    Avatar,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    fetchProducts,
    fetchCategories,
    fetchFilterOptions,
    setSearch,
    setCategory,
    setBenefits,
    setSortBy,
    setPage,
    resetFilters
} from '../store/slices';
import { ProductCard, Footer } from '../components';
import {
    Search as SearchIcon,
    LayoutGrid,
    RefreshCw,
    ShoppingBag,
    Beaker,
    ArrowUpDown
} from 'lucide-react';

export const ProductsPage = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        products,
        categories,
        filterOptions,
        loading,
        search,
        selectedCategory,
        selectedBenefits,
        sortBy,
        currentPage,
        totalPages
    } = useAppSelector((state) => state.products);

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            dispatch(setCategory(category));
        }
        dispatch(fetchCategories({}));
        dispatch(fetchFilterOptions());
    }, [dispatch, searchParams]);

    useEffect(() => {
        dispatch(
            fetchProducts({
                search,
                categoryId: selectedCategory || undefined,
                benefits: selectedBenefits.length > 0 ? selectedBenefits : undefined,
                sortBy,
                page: currentPage,
            })
        );
    }, [dispatch, search, selectedCategory, selectedBenefits, sortBy, currentPage]);

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

    const handleBenefitToggle = (benefit: string) => {
        const newBenefits = selectedBenefits.includes(benefit)
            ? selectedBenefits.filter(b => b !== benefit)
            : [...selectedBenefits, benefit];
        dispatch(setBenefits(newBenefits));
    };

    const handleSortChange = (event: any) => {
        dispatch(setSortBy(event.target.value));
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(setPage(value));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const FilterSidebar = () => (
        <Stack spacing={4}>
            {/* Categories */}
            <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <LayoutGrid size={18} color="#10b981" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Kategoriler</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Button
                        variant={!selectedCategory ? 'contained' : 'text'}
                        fullWidth
                        onClick={() => handleCategoryChange(null)}
                        sx={{
                            justifyContent: 'flex-start',
                            borderRadius: 2,
                            fontWeight: !selectedCategory ? 800 : 500,
                            color: !selectedCategory ? 'white' : 'text.secondary',
                            bgcolor: !selectedCategory ? 'primary.main' : 'transparent',
                            '&:hover': { bgcolor: !selectedCategory ? 'primary.dark' : 'emerald.50' }
                        }}
                    >
                        Tümü
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'contained' : 'text'}
                            fullWidth
                            onClick={() => handleCategoryChange(cat.id)}
                            sx={{
                                justifyContent: 'flex-start',
                                borderRadius: 2,
                                fontWeight: selectedCategory === cat.id ? 800 : 500,
                                color: selectedCategory === cat.id ? 'white' : 'text.secondary',
                                bgcolor: selectedCategory === cat.id ? 'primary.main' : 'transparent',
                                '&:hover': { bgcolor: selectedCategory === cat.id ? 'primary.dark' : 'emerald.50' }
                            }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </Stack>
            </Box>

            <Divider />

            <Divider />

            {/* Benefits / Content */}

            {/* Benefits / Content */}
            <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Beaker size={18} color="#10b981" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Faydalar & İçerik</Typography>
                </Stack>
                <FormGroup>
                    {filterOptions.benefits.map((benefit) => (
                        <FormControlLabel
                            key={benefit}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={selectedBenefits.includes(benefit)}
                                    onChange={() => handleBenefitToggle(benefit)}
                                />
                            }
                            label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{benefit}</Typography>}
                        />
                    ))}
                </FormGroup>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                startIcon={<RefreshCw size={18} />}
                onClick={() => {
                    dispatch(resetFilters());
                    setSearchParams({});
                }}
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 800 }}
            >
                Filtreleri Temizle
            </Button>
        </Stack>
    );

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="xl">
                <Fade in timeout={600}>
                    <Box>
                        {/* Header & Search */}
                        <Grid container spacing={4} sx={{ mb: 6 }} alignItems="flex-end">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: 'emerald.50', borderRadius: 2, display: 'flex' }}>
                                        <ShoppingBag size={24} color="#10b981" />
                                    </Box>
                                    <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                                        Mağaza
                                    </Typography>
                                </Stack>
                                <Typography variant="h2" sx={{ mb: 1 }}>Supplement Dünyası</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    En kaliteli ürünler, en iyi fiyatlarla Supplai'da.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                                    <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Ürün Ara..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            size="small"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><SearchIcon size={18} color="#94a3b8" /></InputAdornment>,
                                                sx: { borderRadius: 3, bgcolor: 'white' }
                                            }}
                                        />
                                    </Box>
                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <InputLabel><Stack direction="row" alignItems="center" spacing={1}><ArrowUpDown size={14} /> Sırala</Stack></InputLabel>
                                        <Select
                                            value={sortBy}
                                            label="Sırala"
                                            onChange={handleSortChange}
                                            sx={{ borderRadius: 3, bgcolor: 'white' }}
                                        >
                                            <MenuItem value="newest">En Yeniler</MenuItem>
                                            <MenuItem value="price_asc">Fiyat (Düşükten Yükseğe)</MenuItem>
                                            <MenuItem value="price_desc">Fiyat (Yüksekten Düşüğe)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            {/* Sidebar Filters */}
                            <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        position: { md: 'sticky' },
                                        top: { md: 100 }
                                    }}
                                >
                                    <FilterSidebar />
                                </Paper>
                            </Grid>

                            {/* Products Grid */}
                            <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
                                        <CircularProgress size={60} thickness={4} />
                                        <Typography variant="overline" sx={{ mt: 3, fontWeight: 900, color: 'text.secondary' }}>YÜKLENİYOR...</Typography>
                                    </Box>
                                ) : products.length === 0 ? (
                                    <Paper sx={{ textAlign: 'center', py: 12, borderRadius: 6, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mx: 'auto', mb: 3 }}><SearchIcon size={40} color="#94a3b8" /></Avatar>
                                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 800 }}>Sonuç Bulunamadı</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Aradığınız kriterlere uygun ürün bulunmuyor.</Typography>
                                        <Button variant="contained" onClick={() => dispatch(resetFilters())} sx={{ borderRadius: 2, px: 4 }}>Tüm Ürünleri Gör</Button>
                                    </Paper>
                                ) : (
                                    <Box>
                                        <Grid container spacing={3}>
                                            {products.map((product) => (
                                                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
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
                                                    shape="rounded"
                                                    sx={{
                                                        '& .MuiPaginationItem-root': { fontWeight: 800, borderRadius: 2 }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
