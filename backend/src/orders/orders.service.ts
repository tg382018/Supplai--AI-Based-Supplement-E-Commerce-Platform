import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateOrderDto } from './dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateOrderDto) {
        // Get products and validate stock
        const productIds = dto.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            throw new NotFoundException('Some products not found');
        }

        // Calculate total and prepare order items
        let total = 0;
        const orderItems = dto.items.map(item => {
            const product = products.find(p => p.id === item.productId)!;

            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${product.name}`);
            }

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        // Create order with items
        const order = await this.prisma.order.create({
            data: {
                userId,
                total,
                shippingAddress: dto.shippingAddress,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        // Update product stock
        for (const item of dto.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return order;
    }

    async findAll(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllAdmin() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId?: string) {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }

        const order = await this.prisma.order.findFirst({
            where,
            include: {
                items: {
                    include: { product: true },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(id: string, status: OrderStatus) {
        await this.findOne(id);

        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
    }

    async updateStripeSession(orderId: string, stripeSessionId: string) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { stripeSessionId },
        });
    }

    async markAsPaid(stripeSessionId: string, stripePaymentId: string) {
        return this.prisma.order.updateMany({
            where: { stripeSessionId },
            data: {
                status: OrderStatus.PAID,
                stripePaymentId,
            },
        });
    }
}
