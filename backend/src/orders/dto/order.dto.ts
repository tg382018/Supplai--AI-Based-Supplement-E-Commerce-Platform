import { IsArray, IsNumber, IsString, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    shippingAddress?: string;
}

export class UpdateOrderStatusDto {
    @ApiProperty()
    @IsString()
    status: string;
}
