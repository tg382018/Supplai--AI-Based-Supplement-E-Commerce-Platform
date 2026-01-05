import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Button,
    IconButton,
    Chip,
    Paper,
    CircularProgress,
    Avatar,
    Divider,
    Fade
} from '@mui/material';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import { productService } from '../services';
import type { Product } from '../types';
import { Footer } from '../components';
import {
    ChevronLeft,
    ShoppingCart,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
    Sparkles,
    CheckCircle2,
    Info,
    PackageSearch,
    RefreshCw
} from 'lucide-react';

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await productService.getProduct(id);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress size={60} thickness={4} color="primary" />
                <Typography variant="overline" sx={{ mt: 3, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.2em' }}>
                    Ürün Bilgileri Hesaplanıyor...
                </Typography>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mb: 3, color: 'grey.300' }}>
                    <PackageSearch size={40} />
                </Avatar>
                <Typography variant="h3" sx={{ mb: 1 }}>Ürün Bulunamadı</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                    Aradığınız ürün sitemizde bulunmuyor veya kaldırılmış olabilir.
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/products')}
                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}
                >
                    Mağazaya Dön
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="lg">
                <Button
                    onClick={() => navigate(-1)}
                    startIcon={<ChevronLeft size={20} />}
                    sx={{
                        mb: 6,
                        fontWeight: 900,
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    MAĞAZAYA DÖN
                </Button>

                <Fade in timeout={800}>
                    <Grid container spacing={{ xs: 6, lg: 10 }}>
                        {/* Left: Product Media */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box sx={{ position: 'sticky', top: 100 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        aspectRatio: '1/1',
                                        borderRadius: 10,
                                        bgcolor: 'white',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 6,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    {product.imageUrl ? (
                                        <Box
                                            component="img"
                                            src={product.imageUrl}
                                            alt={product.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                transition: 'transform 0.6s ease',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ textAlign: 'center', opacity: 0.1 }}>
                                            <PackageSearch size={120} />
                                        </Box>
                                    )}

                                    {/* Badges */}
                                    <Stack spacing={1.5} sx={{ position: 'absolute', top: 24, left: 24 }}>
                                        {product.tags?.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag.replace('_', ' ')}
                                                sx={{
                                                    fontWeight: 900,
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    fontSize: '0.65rem'
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>

                        {/* Right: Product Info */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box>
                                <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                                    <Chip
                                        label={product.category?.name || 'GENEL'}
                                        color="primary"
                                        size="small"
                                        sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    />
                                    {product.stock > 0 && product.stock < 10 && (
                                        <Chip
                                            label={`AZALAN STOK: ${product.stock}`}
                                            color="warning"
                                            size="small"
                                            sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        />
                                    )}
                                </Stack>

                                <Typography variant="h1" sx={{ mb: 4, lineHeight: 1.1 }}>
                                    {product.name}
                                </Typography>

                                <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ mb: 6 }}>
                                    <Typography variant="h2" color="text.primary">
                                        ₺{product.price.toLocaleString('tr-TR')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.1em' }}>
                                        KDV DAHİL
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        mb: 8,
                                        lineHeight: 1.8,
                                        borderLeft: '4px solid',
                                        borderColor: 'emerald.100',
                                        pl: 4,
                                        fontStyle: 'italic',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    "{product.description}"
                                </Typography>

                                {/* Inventory & CTA Section */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: 8,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        mb: 6,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: 4,
                                                p: 0.5,
                                                bgcolor: 'background.default'
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'emerald.50' } }}
                                            >
                                                <Minus size={20} />
                                            </IconButton>
                                            <Typography sx={{ width: 50, textAlign: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                                                {quantity}
                                            </Typography>
                                            <IconButton
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'emerald.50' } }}
                                            >
                                                <Plus size={20} />
                                            </IconButton>
                                        </Paper>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={product.stock <= 0}
                                            onClick={handleAddToCart}
                                            startIcon={<ShoppingCart size={22} />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 6,
                                                fontSize: '1.1rem',
                                                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                            }}
                                        >
                                            {product.stock > 0 ? 'SEPETE EKLE' : 'STOKTA YOK'}
                                        </Button>
                                    </Stack>
                                </Paper>

                                {/* Specifications */}
                                <Grid container spacing={4} sx={{ mb: 10 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper sx={{ p: 4, borderRadius: 6, height: '100%' }}>
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                                <Sparkles size={20} color="#ff8e3c" />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>KAZANIMLAR</Typography>
                                            </Stack>
                                            <Stack spacing={2}>
                                                {product.benefits?.map((ben, i) => (
                                                    <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                                                        <CheckCircle2 size={16} color="#10b981" />
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{ben}</Typography>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Paper>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper sx={{ p: 4, borderRadius: 6, height: '100%' }}>
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                                <Info size={20} color="#10b981" />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>İÇERİKLER</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {product.ingredients?.map((ing, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={ing}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 800, color: 'text.secondary', borderColor: 'divider' }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* Trust Badges */}
                                <Divider sx={{ mb: 6 }} />
                                <Grid container spacing={4}>
                                    {[
                                        { icon: <ShieldCheck size={28} />, label: 'GÜVENLİ ÖDEME' },
                                        { icon: <Truck size={28} />, label: 'HIZLI KARGO' },
                                        { icon: <RefreshCw size={28} />, label: 'KOLAY İADE' }
                                    ].map((badge, i) => (
                                        <Grid size={{ xs: 4 }} key={i} sx={{ textAlign: 'center' }}>
                                            <Box sx={{ color: 'primary.main', mb: 1.5 }}>{badge.icon}</Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', display: 'block' }}>
                                                {badge.label}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
