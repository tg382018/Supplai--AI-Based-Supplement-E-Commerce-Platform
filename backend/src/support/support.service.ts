import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus, MessageSender } from '@prisma/client';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    async createTicket(userId: string, subject: string, initialMessage: string) {
        return this.prisma.supportTicket.create({
            data: {
                subject,
                userId,
                messages: {
                    create: {
                        content: initialMessage,
                        sender: MessageSender.USER,
                    },
                },
            },
            include: { messages: true },
        });
    }

    async getMyTickets(userId: string) {
        return this.prisma.supportTicket.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getTicketById(ticketId: string, userId: string, isAdmin: boolean) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                user: { select: { id: true, name: true, email: true } },
            },
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        if (!isAdmin && ticket.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return ticket;
    }

    async addMessage(ticketId: string, userId: string, content: string, isAdmin: boolean) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        if (!isAdmin && ticket.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        if (ticket.status === TicketStatus.CLOSED) {
            throw new ForbiddenException('Ticket is closed');
        }

        const message = await this.prisma.ticketMessage.create({
            data: {
                content,
                sender: isAdmin ? MessageSender.ADMIN : MessageSender.USER,
                ticketId,
            },
        });

        await this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() },
        });

        return message;
    }

    async getAllTickets() {
        return this.prisma.supportTicket.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async closeTicket(ticketId: string) {
        return this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status: TicketStatus.CLOSED },
        });
    }

    async reopenTicket(ticketId: string) {
        return this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status: TicketStatus.OPEN },
        });
    }
}
