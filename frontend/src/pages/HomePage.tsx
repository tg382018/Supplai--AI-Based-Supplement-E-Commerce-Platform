import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    Chip,
    Paper,
    Avatar
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchFeatured, fetchCategories } from '../store/slices';
import {
    ProductCard,
    Footer
} from '../components';
import {
    Zap,
    ShieldCheck,
    Truck,
    ArrowRight,
    Sparkles,
    ShoppingBag,
    CheckCircle2
} from 'lucide-react';

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { featured, categories } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchFeatured());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                component="section"
                sx={{
                    position: 'relative',
                    minHeight: '85vh',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    bgcolor: 'white',
                    py: { xs: 8, md: 0 }
                }}
            >
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    opacity: 0.1,
                    pointerEvents: 'none'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        filter: 'blur(100px)'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: -100,
                        width: 320,
                        height: 320,
                        bgcolor: 'secondary.main',
                        borderRadius: '50%',
                        filter: 'blur(80px)'
                    }} />
                </Box>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box sx={{ animation: 'fade-up 0.6s ease-out' }}>
                                <Chip
                                    icon={<Sparkles size={16} />}
                                    label="Yeni Nesil Supplement Deneyimi"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        mb: 4,
                                        fontWeight: 800,
                                        bgcolor: 'emerald.50',
                                        borderColor: 'primary.light',
                                        px: 1
                                    }}
                                />
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '3rem', md: '4.5rem' },
                                        color: 'text.primary',
                                        mb: 4,
                                        lineHeight: 1.1
                                    }}
                                >
                                    Sağlığınız İçin <br />
                                    <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>Zeki</Box> Seçimler
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mb: 6, fontWeight: 500, lineHeight: 1.6, maxWidth: 500 }}
                                >
                                    AI asistanımız hedeflerinizi anlar, vücudunuzun ihtiyaç duyduğu en doğru takviyeleri saniyeler içinde size özel olarak seçer.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                    <Button
                                        component={RouterLink}
                                        to="/ai-advisor"
                                        variant="contained"
                                        size="large"
                                        endIcon={<Zap size={20} />}
                                        sx={{
                                            px: 5,
                                            py: 2,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        AI Danışmana Sor
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/products"
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                        sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
                                    >
                                        Mağazayı Gez
                                    </Button>
                                </Stack>

                                <Stack direction="row" spacing={4} sx={{ mt: 8, opacity: 0.5 }}>
                                    {['Lab Onaylı', '%100 Doğal', 'GMP Sertifikalı'].map(text => (
                                        <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle2 size={18} />
                                            <Typography variant="caption" sx={{ fontWeight: 800 }}>{text}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Box sx={{ position: 'relative' }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '8px solid white',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                        sx={{ width: '100%', height: 600, objectFit: 'cover' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 24,
                                        left: 24,
                                        right: 24,
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(20px)',
                                        p: 3,
                                        borderRadius: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2 }}>
                                            <ShieldCheck color="white" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Güvenilir İçerik</Typography>
                                            <Typography variant="caption" color="text.secondary">Tüm ürünlerimiz test edilmiş ve onaylanmıştır.</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper sx={{
                                    position: 'absolute',
                                    top: -40,
                                    right: -40,
                                    p: 3,
                                    borderRadius: 6,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>4.9</Typography>
                                    <Stack direction="row" spacing={0.5} sx={{ color: 'warning.main', my: 0.5 }}>
                                        {[...Array(5)].map((_, i) => <Sparkles key={i} size={14} fill="currentColor" />)}
                                    </Stack>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>KULLANICI PUANI</Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box component="section" sx={{ py: { xs: 12, md: 20 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="h2" sx={{ mb: 3 }}>Neden Supplai'ı Seçmelisiniz?</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Supplement dünyasında kaybolmayın. Bilim ve yapay zeka ile size en doğru yolu gösteriyoruz.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {[
                            {
                                icon: <Zap size={40} />,
                                title: 'AI Destekli Analiz',
                                desc: 'Gelişmiş algoritmalarımız vücut tipiniz ve hedeflerinize göre en verimli kombinasyonları oluşturur.',
                                color: 'primary.light',
                                bgcolor: 'emerald.50'
                            },
                            {
                                icon: <ShieldCheck size={40} />,
                                title: 'Üstün Kalite',
                                desc: 'Dünyanın en güvenilir markaları ve laboratuvar onaylı içerikler ile sağlığınızı koruyoruz.',
                                color: 'primary.main',
                                bgcolor: 'blue.50'
                            },
                            {
                                icon: <Truck size={40} />,
                                title: 'Ekspres Teslimat',
                                desc: 'Eksik takviyeleriniz için beklemenize gerek yok. Aynı gün kargo ve hızlı teslimat avantajı.',
                                color: 'secondary.main',
                                bgcolor: 'orange.50'
                            },
                        ].map((feature, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Paper sx={{ p: 6, height: '100%', '&:hover img': { transform: 'scale(1.1)' } }}>
                                    <Box sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 4,
                                        bgcolor: feature.bgcolor,
                                        color: feature.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 4
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ mb: 2 }}>{feature.title}</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {feature.desc}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Categories Section */}
            {categories.length > 0 && (
                <Box component="section" sx={{ py: { xs: 12, md: 20 }, bgcolor: 'white' }}>
                    <Container maxWidth="lg">
                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" spacing={4} sx={{ mb: 8 }}>
                            <Box sx={{ maxWidth: 600 }}>
                                <Typography variant="h2" sx={{ mb: 2 }}>Kategorilere Göre Keşfedin</Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Sağlık yolculuğunuzda ihtiyacınız olan her şey kategorilere ayrılmış şekilde burada.
                                </Typography>
                            </Box>
                            <Button
                                component={RouterLink}
                                to="/products"
                                color="primary"
                                endIcon={<ArrowRight />}
                                sx={{ fontWeight: 800, fontSize: '1.1rem' }}
                            >
                                Tümünü İncele
                            </Button>
                        </Stack>

                        <Grid container spacing={4}>
                            {categories.map((category) => (
                                <Grid size={{ xs: 6, md: 3 }} key={category.id}>
                                    <Paper
                                        component={RouterLink}
                                        to={`/products?category=${category.id}`}
                                        sx={{
                                            display: 'block',
                                            position: 'relative',
                                            height: 300,
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                            textDecoration: 'none',
                                            '&:hover img': { transform: 'scale(1.1)' }
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            bgcolor: 'black',
                                            opacity: 0.4,
                                            zIndex: 1,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                                        }} />
                                        <Box
                                            component="img"
                                            src={category.imageUrl || ''}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.7s ease'
                                            }}
                                        />
                                        {!category.imageUrl && (
                                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justify: 'center' }}>
                                                <ShoppingBag size={48} color="white" opacity={0.2} />
                                            </Box>
                                        )}
                                        <Box sx={{ position: 'absolute', bottom: 24, left: 24, zIndex: 2 }}>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{category.name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                                                {category._count?.products || 0} Ürün Listeleniyor
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            )}

            {/* Featured Section */}
            {featured.length > 0 && (
                <Box component="section" sx={{ py: { xs: 12, md: 20 }, bgcolor: 'background.default' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 10 }}>
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    display: 'block',
                                    mb: 1
                                }}
                            >
                                Popüler Seçimler
                            </Typography>
                            <Typography variant="h2">Öne Çıkan Supplementler</Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {featured.slice(0, 8).map((product) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            )}

            {/* CTA Section */}
            <Box component="section" sx={{ py: 12 }}>
                <Container maxWidth="lg">
                    <Paper sx={{
                        position: 'relative',
                        borderRadius: 10,
                        overflow: 'hidden',
                        bgcolor: 'grey.900',
                        py: 12,
                        px: { xs: 4, md: 10 },
                        textAlign: 'center'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '50%',
                            height: '100%',
                            bgcolor: 'primary.main',
                            opacity: 0.1,
                            filter: 'blur(120px)',
                            transform: 'rotate(-12deg) translateX(50%)',
                            pointerEvents: 'none'
                        }} />

                        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto' }}>
                            <Paper sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                mb: 4
                            }}>
                                <Zap size={40} color="#10b981" />
                            </Paper>
                            <Typography variant="h2" sx={{ color: 'white', mb: 3 }}>
                                Size En Uygun Takviyeyi <br />
                                <Box component="span" sx={{ color: 'primary.main' }}>Birlikte Bulalım</Box>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'grey.400', mb: 6, lineHeight: 1.6 }}>
                                AI asistanımıza boy, kilo and hedeflerinizi anlatın, size saniyeler içinde bilimsel temelli öneriler sunsun. Kullanmaya başlamak tamamen ücretsizdir.
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/ai-advisor"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6,
                                    py: 2.5,
                                    fontSize: '1.2rem',
                                    borderRadius: 4,
                                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                🤖 Hemen AI Asistanı Başlat
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* Footer */}
            <Footer />
        </Box>
    );
};
