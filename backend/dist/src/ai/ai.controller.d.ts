import { AiService } from './ai.service';
import { AiRecommendationDto, AiChatMessageDto } from './dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
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
}
