import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role, OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { JwtAuthGuard, RolesGuard, Roles, GetUser } from '../auth';

@ApiTags('orders')
@Controller('api/orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    create(@GetUser('userId') userId: string, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user orders' })
    findAll(@GetUser('userId') userId: string) {
        return this.ordersService.findAll(userId);
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all orders (Admin only)' })
    findAllAdmin() {
        return this.ordersService.findAllAdmin();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
        return this.ordersService.findOne(id, userId);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update order status (Admin only)' })
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, dto.status as OrderStatus);
    }
}
