import React from 'react';
import { useAppSelector } from '../../hooks/useRedux';

const AdminDashboard: React.FC = () => {
    const { products } = useAppSelector((state) => state.products);
    const { user } = useAppSelector((state) => state.auth);

    const stats = [
        { label: 'Toplam Ürün', value: products.length, icon: '💊', color: 'blue' },
        { label: 'Aktif Siparişler', value: '12', icon: '📦', color: 'green' },
        { label: 'Ödenen Toplam', value: '$1,250', icon: '💰', color: 'purple' },
        { label: 'Müşteriler', value: '45', icon: '👥', color: 'orange' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hoş geldin, {user?.name} 👋</h1>
                <p className="text-gray-400">İşte mağazanın bugünkü özeti.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 border-l-4 border-l-primary hover:translate-y-[-4px] transition-transform cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bu Ay</span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Son Siparişler</h3>
                    <div className="text-center py-12 text-gray-500 italic">
                        Henüz detaylı sipariş verisi bulunmuyor.
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">En Çok Satanlar</h3>
                    <div className="space-y-4">
                        {products.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                                <img src={p.imageUrl || ''} alt="" className="w-12 h-12 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                                    <p className="text-xs text-gray-400">${p.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-primary">-- Satış</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
