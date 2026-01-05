import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Box,
    Container,
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    InputBase,
    Paper
} from '@mui/material';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout, fetchCategories, setSearch } from '../store/slices';
import { useEffect } from 'react';
import {
    ShoppingBag,
    LogOut,
    Search,
    LayoutDashboard,
    Compass,
    MessageSquare,
    ClipboardList,
    Menu as MenuIcon,
    Headset as HeadsetIcon
} from 'lucide-react';

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { items } = useAppSelector((state) => state.cart);
    const { categories } = useAppSelector((state) => state.products);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCategories({}));
    }, [dispatch]);

    // Clear search term when navigating away from products page
    useEffect(() => {
        if (location.pathname !== '/products') {
            setSearchTerm('');
        }
    }, [location.pathname]);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();
        await dispatch(logout());
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(setSearch(searchTerm));
            navigate('/products');
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'text.primary'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ height: 80 }}>
                    {/* Logo */}
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            mr: 4
                        }}
                    >
                        <Box
                            component="img"
                            src="/logosupplai.png"
                            alt="Supplai Logo"
                            sx={{
                                height: 70,
                                width: 'auto',
                                display: 'block'
                            }}
                        />
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <Button
                            component={RouterLink}
                            to="/products"
                            startIcon={<Compass size={20} />}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                            Mağaza
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/ai-advisor"
                            startIcon={<MessageSquare size={20} />}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                            AI Asistan
                        </Button>
                        {isAuthenticated && (
                            <Button
                                component={RouterLink}
                                to="/support"
                                startIcon={<HeadsetIcon size={20} />}
                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                                Destek
                            </Button>
                        )}
                        {user?.role === 'ADMIN' && (
                            <Button
                                component={RouterLink}
                                to="/admin"
                                startIcon={<LayoutDashboard size={20} />}
                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                                Admin
                            </Button>
                        )}
                    </Box>

                    {/* Right Side Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        {/* Search Bar */}
                        <Paper
                            component="form"
                            onSubmit={handleSearch}
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: 120, sm: 200, md: 240 },
                                borderRadius: 5,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                boxShadow: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover, &:focus-within': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                            <InputBase
                                name="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ ml: 2, flex: 1, fontSize: '0.9rem', fontWeight: 500 }}
                                placeholder="Ürün arayın..."
                            />
                            <IconButton type="submit" sx={{ p: '8px', color: 'primary.main' }}>
                                <Search size={20} />
                            </IconButton>
                        </Paper>

                        <IconButton
                            component={RouterLink}
                            to="/cart"
                            size="large"
                            sx={{
                                color: 'text.secondary',
                                bgcolor: 'grey.50',
                                '&:hover': { bgcolor: 'emerald.50', color: 'primary.main' }
                            }}
                        >
                            <Badge badgeContent={cartCount} color="secondary">
                                <ShoppingBag size={22} />
                            </Badge>
                        </IconButton>

                        {isAuthenticated ? (
                            <Box sx={{ ml: 1 }}>
                                <Tooltip title="Profil ve Ayarlar">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.light',
                                                color: 'primary.main',
                                                fontWeight: 800,
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {user?.name?.[0].toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseUserMenu}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            mt: 1.5,
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                        <Box sx={{ py: 0.5 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user?.name}</Typography>
                                            <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                                {user?.role}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/orders'); }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ClipboardList size={18} />
                                            Siparişlerim
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <LogOut size={18} />
                                            Çıkış Yap
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="text"
                                    color="inherit"
                                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                                >
                                    Giriş
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                >
                                    Hemen Katıl
                                </Button>
                            </Box>
                        )}

                        {/* Mobile Toggle */}
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ display: { md: 'none' }, ml: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>

            {/* Category Strip */}
            <Box sx={{ borderTop: '1px solid', borderColor: 'primary.dark', bgcolor: 'primary.main' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', gap: 1, py: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                        <Button
                            size="small"
                            onClick={() => navigate('/products')}
                            sx={{
                                color: 'white',
                                borderRadius: 2,
                                minWidth: 'auto',
                                px: 2,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            Tümü
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                size="small"
                                onClick={() => navigate(`/products?category=${category.id}`)}
                                sx={{
                                    color: 'white',
                                    borderRadius: 2,
                                    minWidth: 'auto',
                                    px: 2,
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </Box>
                </Container>
            </Box>
        </AppBar>
    );
};
