import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import { orderService } from '../../services';

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

    if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

    const statCards = [
        { label: 'Toplam Gelir', value: `₺${stats?.totalRevenue.toFixed(2)}`, icon: '💰', color: 'green' },
        { label: 'Aktif Siparişler', value: stats?.activeOrdersCount, icon: '📦', color: 'blue' },
        { label: 'Toplam Müşteri', value: stats?.totalCustomers, icon: '👥', color: 'purple' },
        { label: 'En Çok Satan', value: stats?.bestSellers[0]?.name || 'N/A', icon: '🏆', color: 'orange' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hoş geldin, {user?.name} 👋</h1>
                <p className="text-gray-400">İşte mağazanın bugünkü özeti.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 border-l-4 border-l-primary hover:translate-y-[-4px] transition-transform cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">CANLI</span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Son Siparişler</h3>
                    </div>
                    {stats?.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {order.user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">₺{order.total.toFixed(2)}</p>
                                        <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 italic">
                            Henüz sipariş verisi bulunmuyor.
                        </div>
                    )}
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">En Çok Satanlar</h3>
                    <div className="space-y-4">
                        {stats?.bestSellers.map((p: any) => (
                            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                                <img src={p.imageUrl || ''} alt="" className="w-12 h-12 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                                    <p className="text-xs text-gray-400">₺{p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-primary">{p.salesCount} Satış</p>
                                </div>
                            </div>
                        ))}
                        {stats?.bestSellers.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                Satış verisi bulunmuyor.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
