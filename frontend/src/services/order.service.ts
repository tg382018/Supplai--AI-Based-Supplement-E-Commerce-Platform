import api from './api';
import type { Order } from '../types';

interface CreateOrderData {
    items: { productId: string; quantity: number }[];
    shippingAddress?: string;
}

export const orderService = {
    async createOrder(data: CreateOrderData): Promise<Order> {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    async getOrders(): Promise<Order[]> {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },

    async getOrder(id: string): Promise<Order> {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    async checkout(orderId: string): Promise<{ url: string; sessionId: string }> {
        const response = await api.post<{ url: string; sessionId: string }>(`/payments/checkout/${orderId}`);
        return response.data;
    },

    async getAdminOrders(): Promise<Order[]> {
        const response = await api.get<Order[]>('/orders/admin');
        return response.data;
    },

    async updateOrderStatus(id: string, status: string): Promise<Order> {
        const response = await api.patch<Order>(`/orders/${id}/status`, { status });
        return response.data;
    },

    async getAdminStats(): Promise<any> {
        const response = await api.get('/orders/stats');
        return response.data;
    },
};
