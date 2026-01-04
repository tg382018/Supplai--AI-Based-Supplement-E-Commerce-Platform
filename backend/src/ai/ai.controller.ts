import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AiRecommendationDto, AiChatMessageDto } from './dto';

@ApiTags('ai')
@Controller('api/ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('recommend')
    @ApiOperation({ summary: 'Get AI-powered product recommendations based on user profile' })
    getRecommendations(@Body() dto: AiRecommendationDto) {
        return this.aiService.getRecommendations(dto);
    }

    @Post('chat')
    @ApiOperation({ summary: 'Chat with AI supplement advisor' })
    chat(@Body() dto: AiChatMessageDto) {
        return this.aiService.chat(dto);
    }
}
