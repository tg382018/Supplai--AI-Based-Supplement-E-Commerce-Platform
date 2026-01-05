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
    Fade,
    Chip,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeFromCart, updateQuantity, clearCart, fetchAddresses, addAddress } from '../store/slices';
import { orderService } from '../services';
import { useState, useEffect } from 'react';
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
    PackageSearch,
    MapPin,
    PlusCircle
} from 'lucide-react';

export const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, total } = useAppSelector((state) => state.cart);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { addresses, loading: loadingAddresses } = useAppSelector((state) => state.addresses);

    const [loading, setLoading] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        title: '',
        address: '',
        city: '',
        district: '',
        phone: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(addAddress(newAddress)).unwrap();
            setShowAddressForm(false);
            setNewAddress({ title: '', address: '', city: '', district: '', phone: '' });
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedAddressId) {
            alert('Lütfen bir teslimat adresi seçin.');
            return;
        }

        const selectedAddr = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddr) return;

        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                shippingAddress: `${selectedAddr.title}: ${selectedAddr.address}, ${selectedAddr.district}/${selectedAddr.city} - Tel: ${selectedAddr.phone}`
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
                                    borderRadius: 0
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
                                    borderRadius: 0,
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
                    <Box sx={{ p: 2, bgcolor: 'emerald.50', borderRadius: 0, display: 'flex' }}>
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
                                            borderRadius: 0,
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
                                                            borderRadius: 0,
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
                                                                borderRadius: 0,
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
                            <Stack spacing={4} sx={{ position: 'sticky', top: 100 }}>
                                {/* Address Selection */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: 0,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'white'
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                        <MapPin size={24} color="#10b981" />
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Teslimat Adresi</Typography>
                                    </Stack>

                                    {isAuthenticated ? (
                                        <>
                                            {loadingAddresses ? (
                                                <CircularProgress size={24} />
                                            ) : addresses.length > 0 ? (
                                                <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                                                    <RadioGroup
                                                        value={selectedAddressId}
                                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                                    >
                                                        {addresses.map((addr) => (
                                                            <Paper
                                                                key={addr.id}
                                                                variant="outlined"
                                                                sx={{
                                                                    mb: 1.5,
                                                                    borderRadius: 0,
                                                                    borderColor: selectedAddressId === addr.id ? 'primary.main' : 'divider',
                                                                    bgcolor: selectedAddressId === addr.id ? 'emerald.50' : 'transparent',
                                                                }}
                                                            >
                                                                <FormControlLabel
                                                                    value={addr.id}
                                                                    control={<Radio size="small" />}
                                                                    label={
                                                                        <Box sx={{ py: 1.5 }}>
                                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{addr.title}</Typography>
                                                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>{addr.city}/{addr.district}</Typography>
                                                                        </Box>
                                                                    }
                                                                    sx={{ width: '100%', m: 0, pl: 1.5 }}
                                                                />
                                                            </Paper>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            ) : (
                                                <Alert severity="warning" sx={{ mb: 3 }}>Henüz kayıtlı adresiniz yok.</Alert>
                                            )}

                                            {!showAddressForm ? (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<PlusCircle size={18} />}
                                                    onClick={() => setShowAddressForm(true)}
                                                    sx={{ borderRadius: 0, borderStyle: 'dashed', borderWidth: 2 }}
                                                >
                                                    Yeni Adres Ekle
                                                </Button>
                                            ) : (
                                                <Box component="form" onSubmit={handleAddAddress} sx={{ mt: 2 }}>
                                                    <Stack spacing={2}>
                                                        <TextField
                                                            label="Adres Başlığı (Ev, İş vb.)"
                                                            size="small"
                                                            fullWidth
                                                            required
                                                            value={newAddress.title}
                                                            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                        <TextField
                                                            label="Tam Adres"
                                                            size="small"
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            required
                                                            value={newAddress.address}
                                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                        <Stack direction="row" spacing={2}>
                                                            <TextField
                                                                label="İl"
                                                                size="small"
                                                                fullWidth
                                                                required
                                                                value={newAddress.city}
                                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                                InputProps={{ sx: { borderRadius: 0 } }}
                                                            />
                                                            <TextField
                                                                label="İlçe"
                                                                size="small"
                                                                fullWidth
                                                                required
                                                                value={newAddress.district}
                                                                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                                                InputProps={{ sx: { borderRadius: 0 } }}
                                                            />
                                                        </Stack>
                                                        <TextField
                                                            label="Telefon"
                                                            size="small"
                                                            fullWidth
                                                            required
                                                            value={newAddress.phone}
                                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                        <Stack direction="row" spacing={1}>
                                                            <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 0 }}>Kaydet</Button>
                                                            <Button onClick={() => setShowAddressForm(false)} variant="text" fullWidth sx={{ borderRadius: 0 }}>İptal</Button>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <Alert severity="info">Adres seçimi için giriş yapmalısınız.</Alert>
                                    )}
                                </Paper>

                                {/* Order Summary */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 5,
                                        borderRadius: 0,
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
                                        disabled={loading || (isAuthenticated && !selectedAddressId)}
                                        onClick={handleCheckout}
                                        endIcon={!loading && <ArrowRight size={20} />}
                                        sx={{
                                            py: 2,
                                            borderRadius: 0,
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
                                                borderRadius: 0,
                                                '& .MuiAlert-message': { fontWeight: 700, fontSize: '0.8rem' }
                                            }}
                                        >
                                            Ödeme yapmak için <Link component={RouterLink} to="/login" sx={{ fontWeight: 900 }}>Giriş Yapılmalı</Link>
                                        </Alert>
                                    )}

                                    {/* Trust Badges */}
                                    <Grid container spacing={2} sx={{ mt: 6 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 0 }}>
                                                <ShieldCheck size={24} color="#94a3b8" />
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 800, color: 'text.secondary' }}>
                                                    GÜVENLİ
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 0 }}>
                                                <Truck size={24} color="#94a3b8" />
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 800, color: 'text.secondary' }}>
                                                    HIZLI
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
