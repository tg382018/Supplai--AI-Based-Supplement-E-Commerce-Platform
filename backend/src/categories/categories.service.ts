import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const existing = await this.prisma.category.findUnique({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException('Category already exists');
        }

        return this.prisma.category.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: { isActive: true },
                    take: 10,
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findOne(id);

        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
