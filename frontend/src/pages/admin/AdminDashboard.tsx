import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Stack,
    Avatar,
    Chip,
    CircularProgress,
    Fade,
    Divider,
    IconButton
} from '@mui/material';
import { useAppSelector } from '../../hooks/useRedux';
import { orderService } from '../../services';
import {
    DollarSign,
    Package,
    Users,
    Trophy,
    TrendingUp,
    Clock,
    CheckCircle2,
    Calendar,
    ArrowUpRight
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await orderService.getAdminStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
                <CircularProgress size={40} thickness={4} color="primary" />
                <Typography variant="overline" sx={{ mt: 2, fontWeight: 900, color: 'text.secondary' }}>Veriler Hazırlanıyor...</Typography>
            </Box>
        );
    }

    const statCards = [
        { label: 'Toplam Gelir', value: `₺${stats?.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, icon: <DollarSign size={24} />, color: '#10b981', bgcolor: '#ecfdf5' },
        { label: 'Aktif Siparişler', value: stats?.activeOrdersCount, icon: <Package size={24} />, color: '#3b82f6', bgcolor: '#eff6ff' },
        { label: 'Toplam Müşteri', value: stats?.totalCustomers, icon: <Users size={24} />, color: '#8b5cf6', bgcolor: '#f5f3ff' },
        { label: 'En Çok Satan', value: stats?.bestSellers[0]?.name || 'N/A', icon: <Trophy size={24} />, color: '#f59e0b', bgcolor: '#fffbeb' },
    ];

    return (
        <Box sx={{ animate: 'fade-in 0.5s ease' }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 900 }}>Hoş geldin, {user?.name} 👋</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>İşte mağazanın bugünkü özeti.</Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
                        <Fade in timeout={400 + (index * 100)}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 6,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderLeft: `4px solid ${stat.color}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Avatar sx={{ bgcolor: stat.bgcolor, color: stat.color, borderRadius: 3, width: 48, height: 48 }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Chip label="CANLI" size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 20, bgcolor: 'grey.50' }} />
                                </Stack>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.1em' }}>{stat.label}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stat.value}</Typography>
                            </Paper>
                        </Fade>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Fade in timeout={800}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 8,
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Son Siparişler</Typography>
                                <IconButton size="small"><ArrowUpRight size={20} /></IconButton>
                            </Box>
                            <Box sx={{ p: 4 }}>
                                {stats?.recentOrders.length > 0 ? (
                                    <Stack spacing={3}>
                                        {stats.recentOrders.map((order: any) => (
                                            <Paper
                                                key={order.id}
                                                variant="outlined"
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.50/30',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 3
                                                }}
                                            >
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 900, width: 44, height: 44 }}>
                                                        {order.user?.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{order.user?.name}</Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}>
                                                            <Calendar size={12} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</Typography>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Typography>
                                                    <Chip
                                                        label={order.status}
                                                        size="small"
                                                        color={order.status === 'PAID' ? 'success' : 'warning'}
                                                        sx={{ fontWeight: 900, fontSize: '0.6rem', height: 20 }}
                                                    />
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Henüz sipariş verisi bulunmuyor.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Fade in timeout={1000}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 8,
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>En Çok Satanlar</Typography>
                            </Box>
                            <Box sx={{ p: 4 }}>
                                <Stack spacing={3}>
                                    {stats?.bestSellers.map((p: any) => (
                                        <Box
                                            key={p.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3,
                                                p: 2,
                                                borderRadius: 4,
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: 'grey.50' }
                                            }}
                                        >
                                            <Avatar
                                                src={p.imageUrl || ''}
                                                variant="rounded"
                                                sx={{ width: 56, height: 56, bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider' }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{p.name}</Typography>
                                                <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>₺{p.price.toLocaleString('tr-TR')}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block' }}>{p.salesCount} SATIŞ</Typography>
                                                <TrendingUp size={16} color="#10b981" />
                                            </Box>
                                        </Box>
                                    ))}
                                    {stats?.bestSellers.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 8 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Satış verisi bulunmuyor.</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
