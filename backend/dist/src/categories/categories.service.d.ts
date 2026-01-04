import { PrismaService } from '../prisma';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        products: {
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
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
}
