import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';

const AdminLayout: React.FC = () => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    // Basic security check: Redirect if not admin
    // Only redirect if NOT loading AND (no user OR user is not admin)
    useEffect(() => {
        if (!loading && (!user || user.role !== 'ADMIN')) {
            // If there's a token but no user yet, we might still be loading data from App.tsx fetchUser
            // So we check if we have a token but user is null, we wait a bit.
            if (!token) {
                navigate('/login');
            } else if (user && user.role !== 'ADMIN') {
                navigate('/');
            }
        }
    }, [user, loading, navigate, token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { to: '/admin/products', label: 'Ürün Yönetimi', icon: '💊' },
        { to: '/admin/categories', label: 'Kategoriler', icon: '📁' },
        { to: '/admin/orders', label: 'Siparişler', icon: '📦' },
    ];

    return (
        <div className="flex flex-1 h-full bg-[#0f172a] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
