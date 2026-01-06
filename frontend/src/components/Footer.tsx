import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Stack,
    Grid,
    IconButton,
    Link,
    Divider
} from '@mui/material';
import {
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';

export const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 10,
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={8}>
                    {/* Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            component={RouterLink}
                            to="/"
                            sx={{ display: 'inline-flex', alignItems: 'center', mb: 3 }}
                        >
                            <Box
                                component="img"
                                src="/logosupplai.png"
                                alt="Supplai"
                                sx={{ height: 60 }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, maxWidth: 300 }}>
                            Geleceğin sağlık teknolojilerini bugünden deneyimleyin.
                            Supplai Health ile size özel supplement ve beslenme çözümlerini keşfedin.
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        bgcolor: 'grey.50',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'emerald.50',
                                            transform: 'translateY(-3px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Icon size={18} />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>Hızlı Erişim</Typography>
                        <Stack spacing={2}>
                            {[
                                { name: 'Mağaza', path: '/products' },
                                { name: 'AI Asistan', path: '/ai-advisor' },
                                { name: 'Destek', path: '/support' },
                                { name: 'Sepetim', path: '/cart' },
                                { name: 'Siparişlerim', path: '/orders' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    component={RouterLink}
                                    to={item.path}
                                    color="text.secondary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        '&:hover': { color: 'primary.main', transform: 'translateX(5px)' },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ArrowRight size={14} />
                                    {item.name}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Legal Links */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>Sözleşmeler</Typography>
                        <Stack spacing={2}>
                            {[
                                'Kullanım Koşulları',
                                'Gizlilik Politikası',
                                'Mesafeli Satış Sözleşmesi',
                                'KVKK Aydınlatma Metni',
                                'İade ve İptal Koşulları'
                            ].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    color="text.secondary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        '&:hover': { color: 'primary.main', transform: 'translateX(5px)' },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ArrowRight size={14} />
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact Info */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 800 }}>İletişim</Typography>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1, bgcolor: 'emerald.50', color: 'primary.main', borderRadius: 2 }}>
                                    <Phone size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Telefon</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>+90 (212) 555 0101</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1, bgcolor: 'emerald.50', color: 'primary.main', borderRadius: 2 }}>
                                    <Mail size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>E-posta</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>destek@supplai.com</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1, bgcolor: 'emerald.50', color: 'primary.main', borderRadius: 2 }}>
                                    <MapPin size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Adres</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Levent, İstanbul</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 8 }} />

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        © 2026 Supplai Health. Tüm hakları saklıdır.
                    </Typography>
                    <Stack direction="row" spacing={4}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>

                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};
