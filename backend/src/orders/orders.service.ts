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
        console.log(`Debug: findOne called with id=${id}, userId=${userId}`);
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
            console.log(`Debug: Order not found for id=${id}, userId=${userId}`);
            // Check if order exists at all
            const exists = await this.prisma.order.findUnique({ where: { id } });
            console.log(`Debug: Does order exist without userId filter? ${!!exists}. Order owner: ${exists?.userId}`);
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
        // Find the order first to get its items
        const order = await this.prisma.order.findFirst({
            where: { stripeSessionId },
            include: { items: true },
        });

        if (!order) return;

        // Update product stock only now
        for (const item of order.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return this.prisma.order.update({
            where: { id: order.id },
            data: {
                status: OrderStatus.PAID,
                stripePaymentId,
            },
        });
    }

    async getDashboardStats() {
        const [
            totalRevenue,
            activeOrdersCount,
            totalCustomers,
            recentOrders,
            bestSellersRaw,
        ] = await Promise.all([
            // Total revenue from paid orders
            this.prisma.order.aggregate({
                where: { status: OrderStatus.PAID },
                _sum: { total: true },
            }),
            // Count of non-delivered and non-cancelled orders
            this.prisma.order.count({
                where: {
                    status: {
                        in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED],
                    },
                },
            }),
            // Distinct customers who placed orders (or just total users for simplicity if desired, but let's do users with orders)
            this.prisma.user.count({
                where: { role: 'USER' },
            }),
            // Last 5 orders
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                },
            }),
            // Best sellers based on OrderItem quantities
            this.prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: {
                    _sum: { quantity: 'desc' },
                },
                take: 5,
            }),
        ]);

        // Fetch product details for best sellers
        const bestSellers = await Promise.all(
            bestSellersRaw.map(async (item) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { id: true, name: true, price: true, imageUrl: true },
                });
                return {
                    ...product,
                    salesCount: item._sum.quantity,
                };
            }),
        );

        return {
            totalRevenue: totalRevenue._sum.total || 0,
            activeOrdersCount,
            totalCustomers,
            recentOrders,
            bestSellers,
        };
    }
}
