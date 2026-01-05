import React, { useEffect, useState } from 'react';
import { orderService } from '../../services';
import type { Order } from '../../types';

export const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAdminOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch admin orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        } catch (error) {
            alert('Durum güncellenemedi');
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Sipariş Yönetimi</h1>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Sipariş No</th>
                                <th className="px-6 py-4 font-semibold">Müşteri</th>
                                <th className="px-6 py-4 font-semibold">Tarih</th>
                                <th className="px-6 py-4 font-semibold">Toplam</th>
                                <th className="px-6 py-4 font-semibold">Durum</th>
                                <th className="px-6 py-4 font-semibold">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-semibold text-white">{order.user?.name}</p>
                                            <p className="text-gray-500 text-xs">{order.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">
                                        ₺{order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                                                order.status === 'DELIVERED' ? 'bg-gray-500/20 text-gray-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="PENDING">Bekliyor</option>
                                            <option value="PAID">Ödendi</option>
                                            <option value="PROCESSING">Hazırlanıyor</option>
                                            <option value="SHIPPED">Kargolandı</option>
                                            <option value="DELIVERED">Teslim Edildi</option>
                                            <option value="CANCELLED">İptal Edildi</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 italic">
                        Henüz sipariş bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
};

