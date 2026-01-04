"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_1 = require("../prisma");
const products_1 = require("../products");
const dto_1 = require("./dto");
const uuid_1 = require("uuid");
let AiService = AiService_1 = class AiService {
    configService;
    prisma;
    productsService;
    logger = new common_1.Logger(AiService_1.name);
    constructor(configService, prisma, productsService) {
        this.configService = configService;
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async getRecommendations(dto) {
        const tags = this.extractTagsFromInput(dto);
        const products = await this.productsService.findByTags(tags, 6);
        const aiResponse = await this.generateAiResponse(dto, products);
        return {
            message: aiResponse,
            recommendations: products,
            tags,
        };
    }
    async chat(dto) {
        const sessionId = dto.sessionId || (0, uuid_1.v4)();
        let conversation = await this.prisma.aiConversation.findFirst({
            where: { sessionId },
            orderBy: { createdAt: 'desc' },
        });
        const messages = conversation ? conversation.messages : [];
        messages.push({
            role: 'user',
            content: dto.message,
            timestamp: new Date().toISOString(),
        });
        const tags = this.extractTagsFromMessage(dto.message);
        const products = tags.length > 0
            ? await this.productsService.findByTags(tags, 4)
            : [];
        const aiMessage = await this.generateChatResponse(dto.message, messages, products);
        messages.push({
            role: 'assistant',
            content: aiMessage,
            timestamp: new Date().toISOString(),
        });
        if (conversation) {
            await this.prisma.aiConversation.update({
                where: { id: conversation.id },
                data: { messages },
            });
        }
        else {
            await this.prisma.aiConversation.create({
                data: {
                    sessionId,
                    messages,
                },
            });
        }
        return {
            sessionId,
            message: aiMessage,
            recommendations: products,
        };
    }
    extractTagsFromInput(dto) {
        const tags = [];
        const goalTagMap = {
            [dto_1.Goal.WEIGHT_LOSS]: ['weight_loss', 'fat_burner', 'metabolism'],
            [dto_1.Goal.MUSCLE_GAIN]: ['muscle', 'protein', 'strength'],
            [dto_1.Goal.ENERGY]: ['energy', 'vitality', 'caffeine'],
            [dto_1.Goal.IMMUNITY]: ['immunity', 'vitamin_c', 'zinc'],
            [dto_1.Goal.SLEEP]: ['sleep', 'melatonin', 'relaxation'],
            [dto_1.Goal.STRESS]: ['stress', 'adaptogen', 'calm'],
            [dto_1.Goal.DIGESTION]: ['digestion', 'probiotic', 'gut_health'],
            [dto_1.Goal.SKIN_HEALTH]: ['skin', 'collagen', 'beauty'],
            [dto_1.Goal.JOINT_HEALTH]: ['joint', 'glucosamine', 'mobility'],
            [dto_1.Goal.HEART_HEALTH]: ['heart', 'omega3', 'cardiovascular'],
            [dto_1.Goal.BRAIN_HEALTH]: ['brain', 'focus', 'memory'],
            [dto_1.Goal.GENERAL_WELLNESS]: ['multivitamin', 'wellness', 'health'],
        };
        if (dto.goals) {
            dto.goals.forEach(goal => {
                tags.push(...(goalTagMap[goal] || []));
            });
        }
        const descriptionTags = this.extractTagsFromMessage(dto.description);
        tags.push(...descriptionTags);
        return [...new Set(tags)];
    }
    extractTagsFromMessage(message) {
        const keywords = {
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
        const tags = [];
        Object.entries(keywords).forEach(([keyword, associatedTags]) => {
            if (lowerMessage.includes(keyword)) {
                tags.push(...associatedTags);
            }
        });
        return [...new Set(tags)];
    }
    async generateAiResponse(dto, products) {
        let response = 'Merhaba! Sağlık hedeflerinize göre size özel tavsiyelerim:\n\n';
        if (dto.goals?.includes(dto_1.Goal.WEIGHT_LOSS)) {
            response += '🎯 **Kilo kontrolü için:** Metabolizmayı destekleyen ve yağ yakımını hızlandıran takviyeler öneriyorum.\n\n';
        }
        if (dto.goals?.includes(dto_1.Goal.ENERGY)) {
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
    async generateChatResponse(message, history, products) {
        let response = '';
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            response = 'Merhaba! 👋 Ben Supplai AI asistanınız. Size en uygun supplement önerilerini sunmak için buradayım. Sağlık hedefleriniz veya ihtiyaçlarınız hakkında bana bilgi verebilir misiniz?';
        }
        else if (lowerMessage.includes('teşekkür')) {
            response = 'Rica ederim! 😊 Başka sorularınız varsa yardımcı olmaktan mutluluk duyarım.';
        }
        else if (products.length > 0) {
            response = 'Aradığınız kriterlere göre şu ürünleri önerebilirim:\n\n';
            products.forEach((product, index) => {
                response += `**${index + 1}. ${product.name}** - ${product.price}₺\n`;
                response += `   ${product.description.substring(0, 100)}...\n\n`;
            });
            response += 'Bu ürünlerden herhangi biri hakkında daha fazla bilgi ister misiniz?';
        }
        else {
            response = 'Anlıyorum. Size daha iyi yardımcı olabilmem için şunları söyleyebilir misiniz:\n\n';
            response += '- Yaşınız ve cinsiyetiniz\n';
            response += '- Sağlık hedefleriniz (zayıflama, enerji, uyku vb.)\n';
            response += '- Varsa sağlık durumlarınız\n';
            response += '- Aktivite seviyeniz';
        }
        return response;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_1.PrismaService,
        products_1.ProductsService])
], AiService);
//# sourceMappingURL=ai.service.js.map