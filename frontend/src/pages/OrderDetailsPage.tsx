import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Button,
    Paper,
    Chip,
    Avatar,
    Divider,
    CircularProgress,
    Fade,
    Link
} from '@mui/material';
import { useAppDispatch } from '../hooks';
import { clearCart } from '../store/slices';
import { orderService } from '../services';
import type { Order } from '../types';
import { Footer } from '../components';
import {
    CheckCircle2,
    Package,
    Calendar,
    ChevronLeft,
    ShoppingBag,
    ArrowRight,
    ShieldCheck,
    Truck,
    PackageSearch
} from 'lucide-react';

export const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const isSuccess = searchParams.get('success') === 'true';

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearCart());
        }
    }, [isSuccess, dispatch]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const data = await orderService.getOrder(id);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress size={60} thickness={4} color="primary" />
                <Typography variant="overline" sx={{ mt: 3, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.2em' }}>
                    Sipariş Detayları Bekleniyor...
                </Typography>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mb: 3, color: 'grey.300' }}>
                    <PackageSearch size={40} />
                </Avatar>
                <Typography variant="h3" sx={{ mb: 1 }}>Sipariş Bulunamadı</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                    Görüntülemek istediğiniz sipariş mevcut değil veya erişim izniniz yok.
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/orders')}
                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}
                >
                    Tüm Siparişlerim
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/orders')}
                    startIcon={<ChevronLeft size={20} />}
                    sx={{
                        mb: 6,
                        fontWeight: 900,
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    SİPARİŞLERİME DÖN
                </Button>

                {isSuccess && (
                    <Fade in timeout={800}>
                        <Paper
                            sx={{
                                bgcolor: 'emerald.50',
                                border: '1px solid',
                                borderColor: 'emerald.100',
                                borderRadius: 10,
                                p: 6,
                                textAlign: 'center',
                                mb: 8,
                                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'primary.main',
                                    mx: 'auto',
                                    mb: 3,
                                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)'
                                }}
                            >
                                <CheckCircle2 size={40} color="white" />
                            </Avatar>
                            <Typography variant="h3" sx={{ mb: 2 }}>Mükemmel Seçim!</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', fontSize: '1.1rem', fontWeight: 500 }}>
                                Siparişiniz başarıyla alındı ve ödemeniz onaylandı. Hazırlık sürecine hemen başlıyoruz.
                            </Typography>
                        </Paper>
                    </Fade>
                )}

                <Fade in timeout={600}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 10,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            bgcolor: 'white'
                        }}
                    >
                        {/* Header Details */}
                        <Box sx={{ p: 5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                            <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                                <Grid size={{ xs: 12, sm: 'auto' }}>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                                            <Package size={32} color="#10b981" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                                Sipariş: #{order.id.slice(0, 8).toUpperCase()}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}>
                                                <Calendar size={14} />
                                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 'auto' }}>
                                    {order.status === 'PAID' ? (
                                        <Chip
                                            icon={<CheckCircle2 size={16} />}
                                            label="ÖDEME ONAYLANDI"
                                            color="success"
                                            sx={{ fontWeight: 900, letterSpacing: '0.1em', px: 2, py: 2.5 }}
                                        />
                                    ) : (
                                        <Chip
                                            label={`DURUM: ${order.status}`}
                                            sx={{ fontWeight: 900, letterSpacing: '0.1em', bgcolor: 'grey.100', color: 'grey.600' }}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Order Items */}
                        <Box sx={{ p: 5 }}>
                            <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 900, mb: 4, display: 'block', letterSpacing: '0.2em' }}>
                                SİPARİŞ İÇERİĞİ
                            </Typography>
                            <Stack spacing={4}>
                                {order.items.map((item) => (
                                    <Stack key={item.id} direction="row" spacing={3} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 4,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden'
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
                                            <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'primary.main', color: 'white', width: 24, height: 24, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                {item.quantity}
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{item.product.name}</Typography>
                                            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Adet Fiyat: ₺{item.price.toLocaleString('tr-TR')}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                            ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>

                        {/* Summary Footer */}
                        <Box sx={{ p: 5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                            <Grid container justifyContent="flex-end">
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Stack spacing={2} sx={{ mb: 6 }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="text.secondary" sx={{ fontWeight: 700, variant: 'overline' }}>ARA TOPLAM</Typography>
                                            <Typography sx={{ fontWeight: 800 }}>₺{order.total.toLocaleString('tr-TR')}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography color="text.secondary" sx={{ fontWeight: 700, variant: 'overline' }}>KARGO</Typography>
                                            <Chip label="ÜCRETSİZ" color="primary" size="small" sx={{ fontWeight: 900, height: 20, fontSize: '0.65rem' }} />
                                        </Stack>
                                        <Divider />
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                                            <Typography variant="h6" sx={{ fontWeight: 900 }}>TOPLAM</Typography>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h3" color="primary" sx={{ lineHeight: 1 }}>
                                                    ₺{order.total.toLocaleString('tr-TR')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase' }}>
                                                    GÜVENLİ ÖDEME
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    <Grid container spacing={2} sx={{ mb: 6 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'emerald.50' }}>
                                                    <ShieldCheck size={20} color="#10b981" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>GÜVENLİK</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>BANKA ONAYLI</Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'emerald.50' }}>
                                                    <Truck size={20} color="#10b981" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>LOJİSTİK</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>EKSPRES KARGO</Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        component={RouterLink}
                                        to="/products"
                                        startIcon={<ShoppingBag size={20} />}
                                        endIcon={<ArrowRight size={20} />}
                                        sx={{
                                            py: 2,
                                            borderRadius: 6,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                        }}
                                    >
                                        Alışverişe Devam Et
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
