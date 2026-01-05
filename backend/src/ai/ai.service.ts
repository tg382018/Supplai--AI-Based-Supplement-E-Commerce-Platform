import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { ProductsService } from '../products';
import { AiRecommendationDto, AiChatMessageDto, Goal } from './dto';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        private productsService: ProductsService,
    ) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY') || 'missing_key',
        });
    }

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

        // Fetch all products for context
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                imageUrl: true,
                categoryId: true,
                tags: true,
                benefits: true
            }
        });

        const systemPrompt = `
Sen Supplai adlı bir e-ticaret platformunun AI asistanısın. Görevin kullanıcılara sağlık hedeflerine göre en uygun supplementleri önermek.
Aşağıda stokta olan ürünlerimizin listesi bulunmaktadır:
${JSON.stringify(products, null, 2)}

KURALLAR:
1. Sadece supplementler, spor, sağlık ve beslenme ile ilgili soruları yanıtla.
2. Eğer kullanıcının mesajı bu konularla tamamen alakasızsa, kibarca sadece sağlık ve takviye konularında yardımcı olabileceğini belirt.
3. Kullanıcıdan yaş, boy, kilo ve hedeflerini (kilo verme, kas kazanımı vb.) öğrenmeye çalış.
4. Yanıtlarını her zaman JSON formatında dönmelisin. Yapı şu şekilde olmalıdır:
{
  "isRelevant": boolean,
  "message": "Kullanıcıya döneceğin mesaj (Türkçe)",
  "recommendedProductIds": ["uygun_ürün_id_1", "uygun_ürün_id_2"] // Eğer öneri yapacak kadar bilgi yoksa boş dizi dön.
}
`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...history.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: userMessage }
                ],
                response_format: { type: 'json_object' }
            });

            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('Empty response from OpenAI');
            }
            const aiJson = JSON.parse(content);

            const aiMessage = aiJson.message;
            const recommendedIds = aiJson.recommendedProductIds || [];

            // Fetch the actual product objects for the frontend
            const recommendedProducts = products.filter(p => recommendedIds.includes(p.id));

            // Add to history
            const updatedHistory = [...history];
            updatedHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString(),
            });
            updatedHistory.push({
                role: 'assistant',
                content: aiMessage,
                timestamp: new Date().toISOString(),
            });

            // Save conversation
            if (conversation) {
                await this.prisma.aiConversation.update({
                    where: { id: conversation.id },
                    data: { messages: updatedHistory },
                });
            } else {
                await this.prisma.aiConversation.create({
                    data: {
                        sessionId,
                        messages: updatedHistory,
                    },
                });
            }

            return {
                sessionId,
                message: aiMessage,
                recommendations: recommendedProducts,
            };

        } catch (error) {
            this.logger.error('OpenAI Error:', error);
            return {
                sessionId,
                message: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen biraz sonra tekrar deneyin.',
                recommendations: [],
            };
        }
    }

    private isMessageRelevant(message: string): boolean {
        const lower = message.toLowerCase();
        const healthKeywords = [
            'kilo', 'boy', 'yaş', 'hedef', 'zayıfla', 'kas', 'enerji', 'uyku', 'stres',
            'vitamin', 'protein', 'eklem', 'cilt', 'sağlık', 'diyet', 'antrenman',
            'spor', 'yorgun', 'halsiz', 'bağışıklık', 'şişkinlik', 'sindirim',
            'focus', 'odaklanma', 'hafıza', 'omega', 'magnezyum', 'çinko', 'demir',
            'kalsiyum', 'potasyum', 'b12', 'probiyotik', 'kolajen', 'kreatin',
            'amino', 'yağ yak', 'formda', 'kas yap'
        ];

        // Also check for numbers (likely weight/height/age)
        const hasNumbers = /\d+/.test(message);
        const hasKeywords = healthKeywords.some(k => lower.includes(k));

        return hasKeywords || (hasNumbers && lower.length > 3);
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
            'halsiz': ['energy', 'fatigue'],
            'uyku': ['sleep', 'melatonin'],
            'stres': ['stress', 'adaptogen'],
            'bağışıklık': ['immunity', 'vitamin_c'],
            'kas': ['muscle', 'protein'],
            'eklem': ['joint', 'glucosamine'],
            'cilt': ['skin', 'collagen'],
            'sindirim': ['digestion', 'probiotic'],
            'şişkinlik': ['digestion', 'probiotic'],
            'odaklan': ['focus', 'brain'],
            'hafıza': ['memory', 'brain'],
            'vitamin': ['multivitamin', 'wellness'],
            'protein': ['protein', 'muscle'],
            'omega': ['omega3', 'heart'],
            'çinko': ['immunity', 'zinc'],
            'zinc': ['immunity', 'zinc'],
            'magnezyum': ['relaxation', 'sleep', 'muscle'],
            'magnesium': ['relaxation', 'sleep', 'muscle'],
            'demir': ['energy', 'blood_health'],
            'kalsiyum': ['bone_health', 'joint'],
            'kolajen': ['skin', 'joint'],
            'kreatin': ['muscle', 'strength'],
            'amino': ['muscle', 'recovery'],
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
        let response = '';
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            return 'Merhaba! 👋 Ben Supplai AI asistanınız. Size en uygun supplement önerilerini sunmak için buradayım. Sağlık hedefleriniz veya ihtiyaçlarınız hakkında bana bilgi verebilir misiniz?';
        }

        if (lowerMessage.includes('teşekkür')) {
            return 'Rica ederim! 😊 Başka sorularınız varsa yardımcı olmaktan mutluluk duyarım.';
        }

        if (products.length > 0) {
            response = 'Aradığınız kriterlere ve verdiğiniz bilgilere göre şu ürünleri önerebilirim:\n\n';
            products.forEach((product, index) => {
                response += `**${index + 1}. ${product.name}** - ${product.price}₺\n`;
                response += `   ${product.description.substring(0, 100)}...\n\n`;
            });
            response += 'Bu ürünlerden herhangi biri hakkında daha fazla bilgi ister misiniz?';
            return response;
        }

        // No products found, but message was relevant. Try to be more helpful.
        const hasAge = /\d+/.test(lowerMessage) && (lowerMessage.includes('yaş') || lowerMessage.includes('yas'));
        const hasWeight = /\d+/.test(lowerMessage) && (lowerMessage.includes('kilo') || lowerMessage.includes('kg'));
        const hasHeight = /\d+/.test(lowerMessage) && (lowerMessage.includes('boy') || lowerMessage.includes('cm'));

        if (hasAge || hasWeight || hasHeight) {
            response = 'Bilgileriniz için teşekkürler. Bunları not aldım. ';

            const missing: string[] = [];
            if (!hasAge) missing.push('yaşınız');
            if (!hasWeight) missing.push('kilonuz');
            if (!hasHeight) missing.push('boyunuz');

            if (missing.length > 0) {
                response += `Peki ${missing.join(', ')} ve temel sağlık hedefiniz (örneğin: zayıflama, kas kazanımı, enerji artışı) nedir?`;
            } else {
                response += 'Peki temel sağlık hedefiniz nedir? (Örneğin: zayıflama, daha fazla enerji, kas kazanımı vb.)';
            }
        } else {
            response = 'Anlıyorum. Size en doğru tavsiyeyi verebilmem için hedeflerinizi (zayıflama, enerji, uyku vb.) veya varsa şikayetlerinizi biraz daha detaylandırabilir misiniz?';
        }

        return response;
    }
}
