import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
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
    }>;
    findAll(query: ProductQueryDto): Promise<{
        data: ({
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getFeatured(): Promise<({
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
