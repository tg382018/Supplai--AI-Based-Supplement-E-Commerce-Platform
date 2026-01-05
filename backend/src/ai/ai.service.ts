import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { ProductsService } from '../products';
import { AiRecommendationDto, AiChatMessageDto, Goal } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        private productsService: ProductsService,
    ) { }

    async getRecommendations(dto: AiRecommendationDto) {
        // Extract tags from user goals and description
        const tags = this.extractTagsFromInput(dto);

        // Find matching products based on tags
        const products = await this.productsService.findByTags(tags, 6);

        // Generate AI response
        const aiResponse = await this.generateAiResponse(dto, products);

        return {
            message: aiResponse,
            recommendations: products,
            tags,
        };
    }

    async chat(dto: AiChatMessageDto) {
        const sessionId = dto.sessionId || uuidv4();

        // Get or create conversation
        let conversation = await this.prisma.aiConversation.findFirst({
            where: { sessionId },
            orderBy: { createdAt: 'desc' },
        });

        const history = conversation ? (conversation.messages as any[]) : [];
        const userMessage = dto.message;

        // Check if this is the very first real user message (excluding initial assistant greeting if handled on FE)
        // or if we should check relevance first

        const relevanceCheck = this.isMessageRelevant(userMessage);

        let aiMessage = '';
        let products: any[] = [];

        if (history.length === 0) {
            // First message from user
            if (!relevanceCheck) {
                aiMessage = "Merhaba! Supplai AI asistanınız olarak size en doğru supplementleri önerebilmem için yaşınız, boyunuz, kilonuz ve sağlık hedefleriniz (kilo verme, kas kazanımı, enerji vb.) hakkında bilgi vermeniz gerekiyor. Lütfen bu bilgileri paylaşabilir misiniz?";
            } else {
                // Relevant info provided in first message
                const tags = this.extractTagsFromMessage(userMessage);
                products = await this.productsService.findByTags(tags, 4);
                aiMessage = await this.generateChatResponse(userMessage, history, products);
            }
        } else {
            // Continuation of chat
            if (!relevanceCheck && history.length < 5) { // Only repeat/nag early in the conversation
                aiMessage = "Anlıyorum, ancak size yardımcı olabilmem için hedefleriniz, fiziksel bilgileriniz (boy, kilo, yaş) veya şikayetleriniz (yorgunluk, uykusuzluk vb.) hakkında daha spesifik detaylara ihtiyacım var. Size nasıl yardımcı olabilirim?";
            } else {
                const tags = this.extractTagsFromMessage(userMessage);
                products = await this.productsService.findByTags(tags, 4);
                aiMessage = await this.generateChatResponse(userMessage, history, products);
            }
        }

        // Add user message to history
        history.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
        });

        // Add assistant message to history
        history.push({
            role: 'assistant',
            content: aiMessage,
            timestamp: new Date().toISOString(),
        });

        // Save conversation
        if (conversation) {
            await this.prisma.aiConversation.update({
                where: { id: conversation.id },
                data: { messages: history },
            });
        } else {
            await this.prisma.aiConversation.create({
                data: {
                    sessionId,
                    messages: history,
                },
            });
        }

        return {
            sessionId,
            message: aiMessage,
            recommendations: products,
        };
    }

    private isMessageRelevant(message: string): boolean {
        const lower = message.toLowerCase();
        const healthKeywords = [
            'kilo', 'boy', 'yaş', 'hedef', 'zayıfla', 'kas', 'enerji', 'uyku', 'stres',
            'vitamin', 'protein', 'eklem', 'cilt', 'sağlık', 'diyet', 'antrenman',
            'spor', 'yorgun', 'halsiz', 'bağışıklık', 'şişkinlik', 'sindirim',
            'focus', 'odaklanma', 'hafıza', 'omega', 'magnezyum'
        ];

        // Also check for numbers (likely weight/height/age)
        const hasNumbers = /\d+/.test(message);
        const hasKeywords = healthKeywords.some(k => lower.includes(k));

        return hasKeywords || (hasNumbers && lower.length > 5);
    }

    private extractTagsFromInput(dto: AiRecommendationDto): string[] {
        const tags: string[] = [];

        // Map goals to product tags
        const goalTagMap: Record<Goal, string[]> = {
            [Goal.WEIGHT_LOSS]: ['weight_loss', 'fat_burner', 'metabolism'],
            [Goal.MUSCLE_GAIN]: ['muscle', 'protein', 'strength'],
            [Goal.ENERGY]: ['energy', 'vitality', 'caffeine'],
            [Goal.IMMUNITY]: ['immunity', 'vitamin_c', 'zinc'],
            [Goal.SLEEP]: ['sleep', 'melatonin', 'relaxation'],
            [Goal.STRESS]: ['stress', 'adaptogen', 'calm'],
            [Goal.DIGESTION]: ['digestion', 'probiotic', 'gut_health'],
            [Goal.SKIN_HEALTH]: ['skin', 'collagen', 'beauty'],
            [Goal.JOINT_HEALTH]: ['joint', 'glucosamine', 'mobility'],
            [Goal.HEART_HEALTH]: ['heart', 'omega3', 'cardiovascular'],
            [Goal.BRAIN_HEALTH]: ['brain', 'focus', 'memory'],
            [Goal.GENERAL_WELLNESS]: ['multivitamin', 'wellness', 'health'],
        };

        if (dto.goals) {
            dto.goals.forEach(goal => {
                tags.push(...(goalTagMap[goal] || []));
            });
        }

        // Extract from description
        const descriptionTags = this.extractTagsFromMessage(dto.description);
        tags.push(...descriptionTags);

        return [...new Set(tags)];
    }

    private extractTagsFromMessage(message: string): string[] {
        const keywords: Record<string, string[]> = {
            'zayıfla': ['weight_loss', 'fat_burner'],
            'kilo': ['weight_loss', 'metabolism'],
            'enerji': ['energy', 'vitality'],
            'yorgun': ['energy', 'fatigue'],
            'uyku': ['sleep', 'melatonin'],
            'stres': ['stress', 'adaptogen'],
            'bağışıklık': ['immunity', 'vitamin_c'],
            'kas': ['muscle', 'protein'],
            'eklem': ['joint', 'glucosamine'],
            'cilt': ['skin', 'collagen'],
            'sindirim': ['digestion', 'probiotic'],
            'odaklan': ['focus', 'brain'],
            'hafıza': ['memory', 'brain'],
            'vitamin': ['multivitamin', 'wellness'],
            'protein': ['protein', 'muscle'],
            'omega': ['omega3', 'heart'],
            'weight': ['weight_loss', 'fat_burner'],
            'energy': ['energy', 'vitality'],
            'sleep': ['sleep', 'melatonin'],
            'muscle': ['muscle', 'protein'],
            'immune': ['immunity', 'vitamin_c'],
        };

        const lowerMessage = message.toLowerCase();
        const tags: string[] = [];

        Object.entries(keywords).forEach(([keyword, associatedTags]) => {
            if (lowerMessage.includes(keyword)) {
                tags.push(...associatedTags);
            }
        });

        return [...new Set(tags)];
    }

    private async generateAiResponse(dto: AiRecommendationDto, products: any[]): Promise<string> {
        // For now, generate a template response
        // In production, this would call OpenAI or Gemini API

        let response = 'Merhaba! Sağlık hedeflerinize göre size özel tavsiyelerim:\n\n';

        if (dto.goals?.includes(Goal.WEIGHT_LOSS)) {
            response += '🎯 **Kilo kontrolü için:** Metabolizmayı destekleyen ve yağ yakımını hızlandıran takviyeler öneriyorum.\n\n';
        }

        if (dto.goals?.includes(Goal.ENERGY)) {
            response += '⚡ **Enerji için:** Doğal enerji kaynaklarını içeren ve yorgunluğu azaltan takviyeler ideal olacaktır.\n\n';
        }

        if (products.length > 0) {
            response += '📦 **Size özel ürün önerilerim:**\n';
            products.forEach((product, index) => {
                response += `${index + 1}. **${product.name}** - ${product.price}₺\n`;
                if (product.benefits?.length > 0) {
                    response += `   Faydaları: ${product.benefits.slice(0, 2).join(', ')}\n`;
                }
            });
        }

        response += '\n💡 Bu öneriler genel bilgi amaçlıdır. Herhangi bir sağlık sorununuz varsa mutlaka doktorunuza danışın.';

        return response;
    }

    private async generateChatResponse(message: string, history: any[], products: any[]): Promise<string> {
        // Template-based chat response
        // In production, this would call OpenAI or Gemini API with conversation history

        let response = '';
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            response = 'Merhaba! 👋 Ben Supplai AI asistanınız. Size en uygun supplement önerilerini sunmak için buradayım. Sağlık hedefleriniz veya ihtiyaçlarınız hakkında bana bilgi verebilir misiniz?';
        } else if (lowerMessage.includes('teşekkür')) {
            response = 'Rica ederim! 😊 Başka sorularınız varsa yardımcı olmaktan mutluluk duyarım.';
        } else if (products.length > 0) {
            response = 'Aradığınız kriterlere göre şu ürünleri önerebilirim:\n\n';
            products.forEach((product, index) => {
                response += `**${index + 1}. ${product.name}** - ${product.price}₺\n`;
                response += `   ${product.description.substring(0, 100)}...\n\n`;
            });
            response += 'Bu ürünlerden herhangi biri hakkında daha fazla bilgi ister misiniz?';
        } else {
            response = 'Anlıyorum. Size daha iyi yardımcı olabilmem için şunları söyleyebilir misiniz:\n\n';
            response += '- Yaşınız ve cinsiyetiniz\n';
            response += '- Sağlık hedefleriniz (zayıflama, enerji, uyku vb.)\n';
            response += '- Varsa sağlık durumlarınız\n';
            response += '- Aktivite seviyeniz';
        }

        return response;
    }
}
