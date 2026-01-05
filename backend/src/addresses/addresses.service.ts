import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: any) {
        return this.prisma.address.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(userId: string, id: string) {
        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return this.prisma.address.delete({
            where: { id },
        });
    }
}
