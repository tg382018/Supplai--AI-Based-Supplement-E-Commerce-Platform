import { PrismaService } from '../prisma';
import { CreateOrderDto } from './dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        items: ({
            product: {
                description: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                benefits: string[];
                ingredients: string[];
                usage: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    }>;
    findAll(userId: string): Promise<({
        items: ({
            product: {
                description: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                benefits: string[];
                ingredients: string[];
                usage: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    })[]>;
    findAllAdmin(): Promise<({
        user: {
            email: string;
            name: string;
            id: string;
        };
        items: ({
            product: {
                description: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                benefits: string[];
                ingredients: string[];
                usage: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    })[]>;
    findOne(id: string, userId?: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
        items: ({
            product: {
                description: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                benefits: string[];
                ingredients: string[];
                usage: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    }>;
    updateStatus(id: string, status: OrderStatus): Promise<{
        items: ({
            product: {
                description: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                benefits: string[];
                ingredients: string[];
                usage: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    }>;
    updateStripeSession(orderId: string, stripeSessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        stripeSessionId: string | null;
        stripePaymentId: string | null;
    }>;
    markAsPaid(stripeSessionId: string, stripePaymentId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
