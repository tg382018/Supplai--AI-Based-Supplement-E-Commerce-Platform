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

    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    async getCategory(id: string): Promise<Category> {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },
};
