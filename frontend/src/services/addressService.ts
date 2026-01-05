import api from './api';

export interface Address {
    id: string;
    title: string;
    address: string;
    city: string;
    district: string;
    phone: string;
}

export const addressService = {
    getAll: async () => {
        const response = await api.get<Address[]>('/addresses');
        return response.data;
    },

    create: async (data: Omit<Address, 'id'>) => {
        const response = await api.post<Address>('/addresses', data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/addresses/${id}`);
        return response.data;
    }
};
