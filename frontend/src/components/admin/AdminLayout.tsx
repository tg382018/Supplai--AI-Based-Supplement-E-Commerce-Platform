import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    Divider,
    CircularProgress,
    Stack,
    Fade,
    Paper,
    Container
} from '@mui/material';
import { useAppSelector } from '../../hooks/useRedux';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingBag,
    Shield
} from 'lucide-react';

const DRAWER_WIDTH = 280;

const AdminLayout: React.FC = () => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'ADMIN')) {
            if (!token) {
                navigate('/login');
            } else if (user && user.role !== 'ADMIN') {
                navigate('/');
            }
        }
    }, [user, loading, navigate, token]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <CircularProgress size={60} thickness={4} color="primary" />
            </Box>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={22} />, end: true },
        { to: '/admin/products', label: 'Ürün Yönetimi', icon: <Package size={22} /> },
        { to: '/admin/categories', label: 'Kategoriler', icon: <Layers size={22} /> },
        { to: '/admin/orders', label: 'Siparişler', icon: <ShoppingBag size={22} /> },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: 'white',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        backgroundImage: 'none'
                    },
                }}
            >
                <Box sx={{ p: 4, pt: 5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 0, width: 44, height: 44 }}>
                            <Shield size={24} color="white" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Admin Panel</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SİSTEM YÖNETİCİSİ</Typography>
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ mx: 3, my: 2, opacity: 0.5 }} />

                <List sx={{ px: 2, py: 2 }}>
                    {navItems.map((item) => {
                        const isActive = item.end
                            ? location.pathname === item.to
                            : location.pathname.startsWith(item.to);

                        return (
                            <ListItem key={item.to} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.to}
                                    sx={{
                                        borderRadius: 0,
                                        py: 1.5,
                                        bgcolor: isActive ? 'emerald.50' : 'transparent',
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        '&:hover': {
                                            bgcolor: isActive ? 'emerald.50' : 'grey.50',
                                            color: isActive ? 'primary.main' : 'primary.main'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: 44,
                                        color: isActive ? 'primary.main' : 'inherit'
                                    }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 900 : 700,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Box sx={{ mt: 'auto', p: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 0,
                            bgcolor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'divider',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', display: 'block', mb: 1 }}>SUPPLAI ADMIN V1.0</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Güvenli Bağlantı Aktif</Typography>
                    </Paper>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 4, md: 8 },
                    pt: { xs: 12, md: 16 },
                    minHeight: '100vh',
                    bgcolor: 'grey.50/30'
                }}
            >
                <Container maxWidth="lg">
                    <Fade in timeout={600}>
                        <Box>
                            <Outlet />
                        </Box>
                    </Fade>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLayout;
