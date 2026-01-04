import api from './api';
import type { User } from '../types';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const authService = {
    async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: { email: string; password: string }): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getMe(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });
        return response.data;
    },
};
