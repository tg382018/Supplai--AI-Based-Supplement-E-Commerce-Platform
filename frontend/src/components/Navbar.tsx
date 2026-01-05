import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store/slices';
import {
    ShoppingBag,
    LogOut,
    Search,
    LayoutDashboard,
    Compass,
    MessageSquare,
    ClipboardList
} from 'lucide-react';

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { items } = useAppSelector((state) => state.cart);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="glass-light sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Supp<span className="text-primary">lai</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/products" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-all group">
                            <Compass className="w-5 h-5 group-hover:animate-pulse" />
                            Mağaza
                        </Link>
                        <Link to="/ai-advisor" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-all group">
                            <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
                            AI Asistan
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-all group">
                                <LayoutDashboard className="w-5 h-5" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        {/* Search (Placeholder) */}
                        <button className="text-gray-400 hover:text-primary transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2.5 bg-gray-50 hover:bg-emerald-50 rounded-full transition-all group">
                            <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <Link to="/orders" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                                    <ClipboardList className="w-4 h-4" />
                                    Siparişlerim
                                </Link>
                                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-900">{user?.name}</span>
                                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{user?.role}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300"
                                        title="Çıkış Yap"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                                    Giriş
                                </Link>
                                <Link to="/register" className="btn-primary text-sm shadow-emerald-100 shadow-xl">
                                    Hemen Katıl
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
