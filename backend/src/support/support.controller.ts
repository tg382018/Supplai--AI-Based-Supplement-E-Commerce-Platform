import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('api/support')
@UseGuards(JwtAuthGuard)
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post('tickets')
    async createTicket(
        @GetUser('userId') userId: string,
        @Body() body: { subject: string; message: string },
    ) {
        return this.supportService.createTicket(userId, body.subject, body.message);
    }

    @Get('tickets')
    async getMyTickets(@GetUser('userId') userId: string) {
        return this.supportService.getMyTickets(userId);
    }

    @Get('tickets/:id')
    async getTicketById(
        @GetUser('userId') userId: string,
        @GetUser('role') role: string,
        @Param('id') id: string
    ) {
        const isAdmin = role === Role.ADMIN;
        return this.supportService.getTicketById(id, userId, isAdmin);
    }

    @Post('tickets/:id/messages')
    async addMessage(
        @GetUser('userId') userId: string,
        @GetUser('role') role: string,
        @Param('id') id: string,
        @Body() body: { content: string },
    ) {
        const isAdmin = role === Role.ADMIN;
        return this.supportService.addMessage(id, userId, body.content, isAdmin);
    }

    // Admin endpoints
    @Get('admin/tickets')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async getAllTickets() {
        return this.supportService.getAllTickets();
    }

    @Patch('tickets/:id/close')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async closeTicket(@Param('id') id: string) {
        return this.supportService.closeTicket(id);
    }

    @Patch('tickets/:id/reopen')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async reopenTicket(@Param('id') id: string) {
        return this.supportService.reopenTicket(id);
    }
}
