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
import { Role } from '@prisma/client';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post('tickets')
    async createTicket(
        @Request() req,
        @Body() body: { subject: string; message: string },
    ) {
        return this.supportService.createTicket(req.user.id, body.subject, body.message);
    }

    @Get('tickets')
    async getMyTickets(@Request() req) {
        return this.supportService.getMyTickets(req.user.id);
    }

    @Get('tickets/:id')
    async getTicketById(@Request() req, @Param('id') id: string) {
        const isAdmin = req.user.role === Role.ADMIN;
        return this.supportService.getTicketById(id, req.user.id, isAdmin);
    }

    @Post('tickets/:id/messages')
    async addMessage(
        @Request() req,
        @Param('id') id: string,
        @Body() body: { content: string },
    ) {
        const isAdmin = req.user.role === Role.ADMIN;
        return this.supportService.addMessage(id, req.user.id, body.content, isAdmin);
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
