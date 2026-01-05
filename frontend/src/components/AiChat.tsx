import { useState, useRef, useEffect } from 'react';
import { aiService } from '../services';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import {
    Send,
    Bot,
    User,
    Sparkles,
    RefreshCcw,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AiChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Merhaba! 👋 Ben Supplai AI asistanınız. Size en uygun supplement önerilerini sunabilmem için yaşınız, boyunuz, kilonuz ve sağlık hedefleriniz hakkında bilgi verebilir misiniz?',
        },
    ]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string>();
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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
                { role: 'assistant', content: 'Üzgünüm, bir bağlantı sorunu oluştu. Lütfen tekrar deneyebilir misiniz?' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 h-[750px] relative">
            {/* Chat Container */}
            <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-50 bg-white/50 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">AI Sağlık Danışmanı</h2>
                            <p className="text-xs text-emerald-500 font-bold tracking-wider uppercase">Çevrimiçi</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setMessages([{
                                role: 'assistant',
                                content: 'Merhaba! 👋 Tekrar hoş geldiniz. Nasıl yardımcı olabilirim?',
                            }]);
                            setRecommendations([]);
                        }}
                        className="p-3 text-gray-400 hover:text-primary hover:bg-emerald-50 rounded-xl transition-all"
                        title="Sohbeti Sıfırla"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scrollbar-hide">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                        >
                            <div className={`flex items-end gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-gray-100' : 'bg-emerald-50'
                                    }`}>
                                    {message.role === 'user' ? <User className="w-4 h-4 text-gray-400" /> : <Sparkles className="w-4 h-4 text-primary" />}
                                </div>
                                <div
                                    className={`px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${message.role === 'user'
                                            ? 'bg-gray-900 text-white rounded-br-none'
                                            : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-fade-up">
                            <div className="flex items-end gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-gray-50 px-6 py-4 rounded-3xl rounded-bl-none border border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-8 bg-gray-50/50 border-t border-gray-50">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Bir şeyler yazın veya soru sorun..."
                            className="w-full bg-white text-gray-900 pl-6 pr-16 py-5 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-emerald-50 transition-all outline-none shadow-sm placeholder:text-gray-400"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={`absolute right-3 p-3 rounded-xl transition-all ${!input.trim() || loading
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-primary text-white shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-center mt-4 text-[11px] text-gray-400 font-medium">
                        AI asistanı bazen hatalı öneriler sunabilir. Her zaman güvenilir bir sağlık profesyoneline danışın.
                    </p>
                </form>
            </div>

            {/* Recommendations Sidebar */}
            <div className={`xl:w-[450px] flex flex-col transition-all duration-500 ${recommendations.length > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute xl:relative'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                        <span className="p-2 bg-secondary rounded-xl"><Sparkles className="w-5 h-5 text-white" /></span>
                        Önerilen Ürünler
                    </h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                        {recommendations.length} Ürün
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-custom">
                    {recommendations.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {recommendations.length > 0 && (
                    <div className="mt-8 p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 animate-fade-up">
                        <div className="flex gap-4">
                            <div className="bg-primary p-3 rounded-2xl flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Mükemmel Paket!</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Yapay zekamız tarafından hazırlanan bu kombinasyon, belirttiğiniz hedefler için en yüksek verimi sağlayacak şekilde tasarlanmıştır.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State for Sidebar */}
            {recommendations.length === 0 && (
                <div className="hidden xl:flex xl:w-[450px] flex-col items-center justify-center p-12 text-center rounded-[40px] border-4 border-dashed border-gray-50">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                        <MessageSquare className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-400 mb-2">Henüz Öneri Yok</h3>
                    <p className="text-sm text-gray-300">Konuşmaya başlayın, AI sizin için en uygun ürünleri burada listeleyecektir.</p>
                </div>
            )}
        </div>
    );
};
