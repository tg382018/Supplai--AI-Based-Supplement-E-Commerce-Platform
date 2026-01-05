import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Button,
    IconButton,
    Paper,
    Divider,
    Avatar,
    Link,
    Alert,
    CircularProgress,
    Fade
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices';
import { orderService } from '../services';
import { useState } from 'react';
import { Footer } from '../components';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    ShieldCheck,
    Truck,
    RefreshCw,
    PackageSearch
} from 'lucide-react';

export const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, total } = useAppSelector((state) => state.cart);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const order = await orderService.createOrder(orderData);
            const checkout = await orderService.checkout(order.id);

            if (checkout.url) {
                window.location.href = checkout.url;
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 24 }, pb: 12 }}>
                <Container maxWidth="sm">
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: 'grey.50',
                                    mx: 'auto',
                                    mb: 4,
                                    borderRadius: 8
                                }}
                            >
                                <PackageSearch size={48} color="#cbd5e1" />
                            </Avatar>
                            <Typography variant="h3" sx={{ mb: 2, fontWeight: 900 }}>Sepetiniz Boş</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                Görünüşe göre henüz sepetinize bir ürün eklememişsiniz. En iyi ürünlerimizi keşfetmeye ne dersiniz?
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/products"
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingBag size={20} />}
                                endIcon={<ArrowRight size={20} />}
                                sx={{
                                    borderRadius: 4,
                                    px: 6,
                                    py: 2,
                                    fontWeight: 900,
                                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                Alışverişe Başla
                            </Button>
                        </Box>
                    </Fade>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="lg">
                <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mb: 8 }}>
                    <Box sx={{ p: 2, bgcolor: 'emerald.50', borderRadius: 4, display: 'flex' }}>
                        <ShoppingBag size={32} color="#10b981" />
                    </Box>
                    <Box>
                        <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                            Siparişiniz
                        </Typography>
                        <Typography variant="h2">Sepetim</Typography>
                    </Box>
                </Stack>

                <Fade in timeout={600}>
                    <Grid container spacing={6}>
                        {/* Cart Items Area */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {items.length} Ürün
                                </Typography>
                                <Button
                                    startIcon={<RefreshCw size={16} />}
                                    onClick={() => dispatch(clearCart())}
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 800,
                                        '&:hover': { color: 'error.main', bgcolor: 'error.lighter' }
                                    }}
                                >
                                    Sepeti Temizle
                                </Button>
                            </Stack>

                            <Stack spacing={3}>
                                {items.map((item) => (
                                    <Paper
                                        key={item.product.id}
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 8,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                                borderColor: 'primary.light'
                                            }
                                        }}
                                    >
                                        <Grid container spacing={4} alignItems="center">
                                            <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                                                <Link
                                                    component={RouterLink}
                                                    to={`/products/${item.product.id}`}
                                                    sx={{ display: 'block', textDecoration: 'none' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            aspectRatio: '1/1',
                                                            borderRadius: 4,
                                                            overflow: 'hidden',
                                                            bgcolor: 'grey.50',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {item.product.imageUrl ? (
                                                            <Box
                                                                component="img"
                                                                src={item.product.imageUrl}
                                                                alt={item.product.name}
                                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <PackageSearch size={32} color="#cbd5e1" />
                                                        )}
                                                    </Box>
                                                </Link>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 7 }}>
                                                <Box>
                                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                        {item.product.category?.name || 'GENEL'}
                                                    </Typography>
                                                    <Link
                                                        component={RouterLink}
                                                        to={`/products/${item.product.id}`}
                                                        sx={{
                                                            display: 'block',
                                                            variant: 'h5',
                                                            fontWeight: 800,
                                                            color: 'text.primary',
                                                            textDecoration: 'none',
                                                            mb: 2,
                                                            '&:hover': { color: 'primary.main' }
                                                        }}
                                                    >
                                                        {item.product.name}
                                                    </Link>

                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Paper
                                                            variant="outlined"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                borderRadius: 3,
                                                                p: 0.5,
                                                                bgcolor: 'background.default'
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'emerald.50' } }}
                                                            >
                                                                <Minus size={14} />
                                                            </IconButton>
                                                            <Typography sx={{ width: 40, textAlign: 'center', fontWeight: 900 }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'emerald.50' } }}
                                                            >
                                                                <Plus size={14} />
                                                            </IconButton>
                                                        </Paper>
                                                    </Stack>
                                                </Box>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 3, md: 3 }} sx={{ textAlign: { sm: 'right' } }}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                                        ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                                        {item.quantity} x ₺{item.product.price.toLocaleString('tr-TR')}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    onClick={() => dispatch(removeFromCart(item.product.id))}
                                                    sx={{
                                                        color: 'text.disabled',
                                                        '&:hover': { color: 'error.main', bgcolor: 'error.lighter' }
                                                    }}
                                                >
                                                    <Trash2 size={20} />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Summary Sidebar */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Box sx={{ position: 'sticky', top: 100 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 5,
                                        borderRadius: 10,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                        bgcolor: 'white'
                                    }}
                                >
                                    <Typography variant="h4" sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                        Sipariş Özeti
                                    </Typography>
                                    <Divider sx={{ mb: 4 }} />

                                    <Stack spacing={3} sx={{ mb: 6 }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Ara Toplam</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>₺{total.toLocaleString('tr-TR')}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Tahmini Kargo</Typography>
                                            <Chip label="Ücretsiz" color="primary" size="small" sx={{ fontWeight: 900, height: 24 }} />
                                        </Stack>
                                        <Divider />
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Toplam</Typography>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h3" color="primary" sx={{ lineHeight: 1 }}>
                                                    ₺{total.toLocaleString('tr-TR')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase' }}>
                                                    KDV Dahil
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        onClick={handleCheckout}
                                        endIcon={!loading && <ArrowRight size={20} />}
                                        sx={{
                                            py: 2,
                                            borderRadius: 6,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Ödemeye Geç'}
                                    </Button>

                                    {!isAuthenticated && (
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mt: 3,
                                                borderRadius: 4,
                                                '& .MuiAlert-message': { fontWeight: 700, fontSize: '0.8rem' }
                                            }}
                                        >
                                            Ödeme yapmak için <Link component={RouterLink} to="/login" sx={{ fontWeight: 900 }}>Giriş Yapılmalı</Link>
                                        </Alert>
                                    )}

                                    {/* Trust Badges */}
                                    <Grid container spacing={2} sx={{ mt: 6 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 4 }}>
                                                <ShieldCheck size={24} color="#94a3b8" />
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 800, color: 'text.secondary' }}>
                                                    GÜVENLİ
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 4 }}>
                                                <Truck size={24} color="#94a3b8" />
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 800, color: 'text.secondary' }}>
                                                    HIZLI
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
