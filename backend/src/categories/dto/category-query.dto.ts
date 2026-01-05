import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryQueryDto {
    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    includeInactive?: boolean;
}
