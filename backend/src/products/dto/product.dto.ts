import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Vitamin D3' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'High quality vitamin D3 supplement for bone health' })
    @IsString()
    description: string;

    @ApiProperty({ example: 29.99 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    stock: number;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ example: 'category-uuid' })
    @IsString()
    categoryId: string;

    @ApiPropertyOptional({ example: ['bone_health', 'immune_support'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ example: ['Supports bone health', 'Boosts immune system'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    benefits?: string[];

    @ApiPropertyOptional({ example: ['Vitamin D3 5000 IU', 'Coconut Oil'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    ingredients?: string[];

    @ApiPropertyOptional({ example: 'Take 1 capsule daily with food' })
    @IsString()
    @IsOptional()
    usage?: string;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class ProductQueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    benefits?: string[];

    @ApiPropertyOptional({ enum: ['price_asc', 'price_desc', 'newest'] })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    includeInactive?: boolean;
}
