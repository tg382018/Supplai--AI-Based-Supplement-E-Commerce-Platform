import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store/slices';

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
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">💊</span>
                        <span className="text-xl font-bold gradient-text">Supplai</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/products" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                            Ürünler
                        </Link>
                        <Link to="/ai-advisor" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-2">
                            <span>🤖</span>
                            AI Asistan
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-[var(--surface)] rounded-lg transition-colors">
                            <span className="text-xl">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/orders" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                                    Siparişlerim
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[var(--text-muted)]">{user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                                    >
                                        Çıkış
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                                    Giriş
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
