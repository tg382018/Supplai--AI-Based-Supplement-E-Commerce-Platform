import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
    CircularProgress,
    Fade,
    Link
} from '@mui/material';
import { orderService } from '../services';
import type { Order } from '../types';
import { Footer } from '../components';
import {
    Package,
    ChevronRight,
    Clock,
    CheckCircle2,
    ClipboardList,
    ArrowRight,
    PackageSearch
} from 'lucide-react';

export const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress size={60} thickness={4} color="primary" />
                <Typography variant="overline" sx={{ mt: 3, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.2em' }}>
                    Siparişleriniz Alınıyor...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mb: 8 }}>
                    <Box sx={{ p: 2, bgcolor: 'emerald.50', borderRadius: 4, display: 'flex' }}>
                        <ClipboardList size={32} color="#10b981" />
                    </Box>
                    <Box>
                        <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                            Hesabım
                        </Typography>
                        <Typography variant="h2">Siparişlerim</Typography>
                    </Box>
                </Stack>

                {orders.length === 0 ? (
                    <Fade in timeout={800}>
                        <Paper
                            elevation={0}
                            sx={{
                                textAlign: 'center',
                                py: 12,
                                px: 4,
                                borderRadius: 10,
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                                bgcolor: 'white'
                            }}
                        >
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
                            <Typography variant="h3" sx={{ mb: 2 }}>Henüz bir siparişiniz yok</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontSize: '1.1rem' }}>
                                Supplai dünyasındaki eşsiz ürünleri keşfetmeye ve ilk siparişinizi oluşturmaya ne dersiniz?
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/products"
                                variant="contained"
                                size="large"
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
                        </Paper>
                    </Fade>
                ) : (
                    <Stack spacing={3}>
                        {orders.map((order, index) => (
                            <Fade in key={order.id} timeout={400 + (index * 100)}>
                                <Link
                                    component={RouterLink}
                                    to={`/orders/${order.id}`}
                                    sx={{ textDecoration: 'none' }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            borderRadius: 8,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                                borderColor: 'primary.light',
                                                '& .detail-button': { transform: 'translateX(8px)' }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                height: '100%',
                                                width: 6,
                                                bgcolor: 'primary.main',
                                                opacity: 0,
                                                transition: 'opacity 0.3s'
                                            },
                                            '&:hover::before': { opacity: 0.1 }
                                        }}
                                    >
                                        <Grid container spacing={4} alignItems="center">
                                            <Grid size={{ xs: 12, sm: 'auto' }}>
                                                <Stack direction="row" spacing={3} alignItems="center">
                                                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.50', borderRadius: 4 }}>
                                                        <Package size={32} color="#cbd5e1" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 900 }}>SİPARİŞ NO</Typography>
                                                        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                            #{order.id.slice(0, 8).toUpperCase()}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 'grow' }}>
                                                <Grid container spacing={4}>
                                                    <Grid size={{ xs: 6, md: 4 }}>
                                                        <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 900 }}>TARİH</Typography>
                                                        <Typography sx={{ fontWeight: 700 }}>
                                                            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6, md: 4 }}>
                                                        <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 900 }}>TOPLAM</Typography>
                                                        <Typography color="primary" sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
                                                            ₺{order.total.toLocaleString('tr-TR')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 900 }}>DURUM</Typography>
                                                        <Box>
                                                            {order.status === 'PAID' ? (
                                                                <Chip
                                                                    icon={<CheckCircle2 size={14} />}
                                                                    label="ÖDENDİ"
                                                                    size="small"
                                                                    color="success"
                                                                    sx={{ fontWeight: 900, letterSpacing: '0.1em' }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    icon={<Clock size={14} />}
                                                                    label={order.status === 'PENDING' ? 'BEKLEMEDE' : order.status}
                                                                    size="small"
                                                                    sx={{ fontWeight: 900, letterSpacing: '0.1em', bgcolor: 'grey.100', color: 'grey.600' }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 'auto' }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    className="detail-button"
                                                    sx={{ transition: 'transform 0.3s ease', color: 'primary.main' }}
                                                >
                                                    <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.1em' }}>DETAYLAR</Typography>
                                                    <ChevronRight size={18} />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Link>
                            </Fade>
                        ))}
                    </Stack>
                )}
            </Container>
            <Footer />
        </Box>
    );
};
