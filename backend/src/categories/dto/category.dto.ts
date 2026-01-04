import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Vitamins' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Essential vitamins and minerals' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
