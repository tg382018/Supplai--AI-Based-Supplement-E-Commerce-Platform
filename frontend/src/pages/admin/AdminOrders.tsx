import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    CircularProgress,
    Fade,
    Stack,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import { orderService } from '../../services';
import type { Order } from '../../types';
import {
    Calendar,
    ShoppingBag,
    MapPin
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAdminOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch admin orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        } catch (error) {
            alert('Durum güncellenemedi');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
                <CircularProgress size={40} thickness={4} color="primary" />
                <Typography variant="overline" sx={{ mt: 2, fontWeight: 900, color: 'text.secondary' }}>Siparişler Alınıyor...</Typography>
            </Box>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'SHIPPED': return 'info';
            case 'DELIVERED': return 'secondary';
            case 'CANCELLED': return 'error';
            default: return 'warning';
        }
    };

    return (
        <Box sx={{ animate: 'fade-in 0.5s ease' }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Sipariş Yönetimi</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Müşteri siparişlerini takip edin, durumlarını güncelleyin ve gönderim süreçlerini yönetin.
                </Typography>
            </Box>

            <Fade in timeout={800}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                    }}
                >
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Sipariş No</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Müşteri</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Tarih</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Adres</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Toplam</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Durum</TableCell>
                                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', textAlign: 'right' }}>İşlem</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    sx={{ '&:hover': { bgcolor: 'grey.50/50' }, transition: 'background-color 0.2s' }}
                                >
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'text.secondary' }}>
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.75rem', fontWeight: 900 }}>
                                                {order.user?.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{order.user?.name}</Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>{order.user?.email}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                                            <Calendar size={14} />
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                                            ₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ color: 'text.secondary', maxWidth: 250 }}>
                                            <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                                                {order.shippingAddress || 'Adres belirtilmemiş'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            size="small"
                                            color={getStatusColor(order.status)}
                                            sx={{ fontWeight: 900, fontSize: '0.65rem', height: 22, px: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <FormControl size="small" sx={{ minWidth: 140 }}>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                sx={{
                                                    borderRadius: 0,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    '& .MuiSelect-select': { py: 1 }
                                                }}
                                            >
                                                <MenuItem value="PENDING" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>BEKLİYOR</MenuItem>
                                                <MenuItem value="PAID" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>ÖDENDİ</MenuItem>
                                                <MenuItem value="PROCESSING" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>HAZIRLANIYOR</MenuItem>
                                                <MenuItem value="SHIPPED" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>KARGOLANDI</MenuItem>
                                                <MenuItem value="DELIVERED" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>TESLİM EDİLDİ</MenuItem>
                                                <MenuItem value="CANCELLED" sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'error.main' }}>İPTAL EDİLDİ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {orders.length === 0 && (
                        <Box sx={{ p: 12, textAlign: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.50', mx: 'auto', mb: 3 }}>
                                <ShoppingBag size={40} color="#cbd5e1" />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Sipariş Bulunamadı</Typography>
                            <Typography variant="body2" color="text.disabled">Henüz mağazanızda gerçekleştirilmiş bir sipariş bulunmuyor.</Typography>
                        </Box>
                    )}
                </TableContainer>
            </Fade>
        </Box>
    );
};
