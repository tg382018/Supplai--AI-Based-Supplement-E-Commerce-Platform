export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    _count?: { products: number };
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category: Category;
    categoryId: string;
    tags: string[];
    benefits: string[];
    ingredients: string[];
    usage?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    stripeSessionId?: string;
    shippingAddress?: string;
    createdAt: string;
}

export interface AiRecommendation {
    message: string;
    recommendations: Product[];
    tags: string[];
}

export interface AiChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
