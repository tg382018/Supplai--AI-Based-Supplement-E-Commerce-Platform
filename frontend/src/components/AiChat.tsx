import { useState } from 'react';
import { aiService } from '../services';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AiChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Merhaba! 👋 Ben Supplai AI asistanınız. Size en uygun supplement önerilerini sunabilmem için yaşınız, boyunuz, kilonuz ve sağlık hedefleriniz (kilo verme, kas kazanımı, enerji vb.) hakkında bilgi verebilir misiniz?',
        },
    ]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string>();
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await aiService.chat(userMessage, sessionId);
            setSessionId(response.sessionId);
            setMessages((prev) => [...prev, { role: 'assistant', content: response.message }]);

            if (response.recommendations?.length > 0) {
                setRecommendations(response.recommendations);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* Chat Section */}
            <div className="flex-1 glass-card flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span>🤖</span> AI Supplement Asistanı
                    </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--surface)] text-[var(--text)]'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-[var(--surface)] rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Mesajınızı yazın..."
                            className="input flex-1"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="btn-primary px-6"
                        >
                            Gönder
                        </button>
                    </div>
                </form>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="lg:w-[400px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>✨</span> Önerilen Ürünler
                    </h3>
                    <div className="space-y-4">
                        {recommendations.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
