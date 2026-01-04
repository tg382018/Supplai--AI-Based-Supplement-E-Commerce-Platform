import api from './api';
import type { AiRecommendation } from '../types';

interface AiRecommendationRequest {
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    goals?: string[];
    healthConditions?: string[];
    dietType?: string;
    activityLevel?: string;
    description: string;
}

interface AiChatResponse {
    sessionId: string;
    message: string;
    recommendations: any[];
}

export const aiService = {
    async getRecommendations(data: AiRecommendationRequest): Promise<AiRecommendation> {
        const response = await api.post<AiRecommendation>('/ai/recommend', data);
        return response.data;
    },

    async chat(message: string, sessionId?: string): Promise<AiChatResponse> {
        const response = await api.post<AiChatResponse>('/ai/chat', { message, sessionId });
        return response.data;
    },
};
