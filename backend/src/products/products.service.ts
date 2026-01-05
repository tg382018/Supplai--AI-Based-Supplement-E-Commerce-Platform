import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                imageUrl: dto.imageUrl,
                categoryId: dto.categoryId,
                tags: dto.tags || [],
                benefits: dto.benefits || [],
                ingredients: dto.ingredients || [],
                usage: dto.usage,
                isActive: dto.isActive ?? true,
            },
            include: {
                category: true,
            },
        });
    }

    async findAll(query: ProductQueryDto) {
        console.log('--- ProductsService.findAll called with query:', JSON.stringify(query, null, 2));
        const { search, categoryId, benefits, minPrice, maxPrice, sortBy, page = 1, limit = 10, includeInactive = false } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (!includeInactive) {
            where.isActive = true;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (benefits && benefits.length > 0) {
            where.benefits = { hasSome: typeof benefits === 'string' ? [benefits] : benefits };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = Number(minPrice);
            if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
            console.log('--- Price Filter Applied:', where.price);
        }

        const order: any = {};
        if (sortBy === 'price_asc') {
            order.price = 'asc';
        } else if (sortBy === 'price_desc') {
            order.price = 'desc';
        } else {
            order.createdAt = 'desc';
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                },
                orderBy: order,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getFilterOptions() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: { tags: true, benefits: true, price: true }
        });

        const tags = Array.from(new Set(products.flatMap(p => p.tags))).sort();
        const benefits = Array.from(new Set(products.flatMap(p => p.benefits))).sort();
        const prices = products.map(p => p.price);

        return {
            tags,
            benefits,
            priceRange: {
                min: Math.min(...prices, 0),
                max: Math.max(...prices, 1000)
            }
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }

    async findByTags(tags: string[], limit = 5) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                tags: { hasSome: tags },
            },
            include: {
                category: true,
            },
            take: limit,
        });
    }

    async getFeatured(limit = 8) {
        return this.prisma.product.findMany({
            where: { isActive: true },
            include: { category: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}
