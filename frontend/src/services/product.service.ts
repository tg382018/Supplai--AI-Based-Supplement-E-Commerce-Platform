import api from './api';
import type { Product, PaginatedResponse, Category } from '../types';

interface ProductQuery {
    search?: string;
    categoryId?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}

export const productService = {
    async getProducts(query: ProductQuery = {}): Promise<PaginatedResponse<Product>> {
        const response = await api.get<PaginatedResponse<Product>>('/products', { params: query });
        return response.data;
    },

    async getProduct(id: string): Promise<Product> {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    async getFeatured(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products/featured');
        return response.data;
    },

    async createProduct(data: Partial<Product>): Promise<Product> {
        const response = await api.post<Product>('/products', data);
        return response.data;
    },

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        const response = await api.patch<Product>(`/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id: string): Promise<void> {
        await api.delete(`/products/${id}`);
    },

    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    async getCategory(id: string): Promise<Category> {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    async createCategory(data: Partial<Category>): Promise<Category> {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        const response = await api.patch<Category>(`/categories/${id}`, data);
        return response.data;
    },

    async deleteCategory(id: string): Promise<void> {
        await api.delete(`/categories/${id}`);
    },
};
