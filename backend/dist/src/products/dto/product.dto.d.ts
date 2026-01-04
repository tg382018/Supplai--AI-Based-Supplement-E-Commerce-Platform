export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: string;
    tags?: string[];
    benefits?: string[];
    ingredients?: string[];
    usage?: string;
    isActive?: boolean;
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export declare class ProductQueryDto {
    search?: string;
    categoryId?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}
export {};
