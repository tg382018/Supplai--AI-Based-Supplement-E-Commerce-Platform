import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { ProductsService } from '../products';
import { AiRecommendationDto, AiChatMessageDto } from './dto';
export declare class AiService {
    private configService;
    private prisma;
    private productsService;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService, productsService: ProductsService);
    getRecommendations(dto: AiRecommendationDto): Promise<{
        message: string;
        recommendations: ({
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            description: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            price: number;
            stock: number;
            imageUrl: string | null;
            categoryId: string;
            benefits: string[];
            ingredients: string[];
            usage: string | null;
            isActive: boolean;
        })[];
        tags: string[];
    }>;
    chat(dto: AiChatMessageDto): Promise<{
        sessionId: string;
        message: string;
        recommendations: ({
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            description: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            price: number;
            stock: number;
            imageUrl: string | null;
            categoryId: string;
            benefits: string[];
            ingredients: string[];
            usage: string | null;
            isActive: boolean;
        })[];
    }>;
    private extractTagsFromInput;
    private extractTagsFromMessage;
    private generateAiResponse;
    private generateChatResponse;
}
