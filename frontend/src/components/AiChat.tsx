import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    IconButton,
    TextField,
    Avatar,
    Fade,
    Grid,
    Chip
} from '@mui/material';
import { aiService } from '../services';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import {
    Send,
    Bot,
    User,
    Sparkles,
    RefreshCcw
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
        <Grid container spacing={4} sx={{ height: { lg: 600 } }}>
            {/* Chat Container */}
            <Grid size={{ xs: 12, lg: recommendations.length > 0 ? 7 : 12 }} sx={{ height: '100%', minHeight: 0 }}>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        borderRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                        bgcolor: 'white'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', borderRadius: 0 }}>
                                    <Bot size={24} color="white" />
                                </Avatar>
                                <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, bgcolor: 'success.main', border: '2px solid white', borderRadius: 0 }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>AI Sağlık Danışmanı</Typography>
                                <Typography variant="caption" color="primary" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ÇEVRİMİÇİ</Typography>
                            </Box>
                        </Stack>
                        <IconButton
                            onClick={() => {
                                setMessages([{
                                    role: 'assistant',
                                    content: 'Merhaba! 👋 Tekrar hoş geldiniz. Nasıl yardımcı olabilirim?',
                                }]);
                                setRecommendations([]);
                            }}
                            sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'emerald.50' } }}
                        >
                            <RefreshCcw size={20} />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 4, bgcolor: 'grey.50/30' }}>
                        <Stack spacing={4}>
                            {messages.map((message, index) => (
                                <Fade in key={index} timeout={500}>
                                    <Box sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <Stack direction={message.role === 'user' ? 'row-reverse' : 'row'} spacing={2} sx={{ maxWidth: '85%' }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: message.role === 'user' ? 'grey.200' : 'emerald.50',
                                                    borderRadius: 0
                                                }}
                                            >
                                                {message.role === 'user' ? <User size={16} color="#64748b" /> : <Sparkles size={16} color="#10b981" />}
                                            </Avatar>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius: 0,
                                                    bgcolor: message.role === 'user' ? 'grey.900' : 'white',
                                                    color: message.role === 'user' ? 'white' : 'text.primary',
                                                    border: message.role === 'user' ? 'none' : '1px solid',
                                                    borderColor: 'divider',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                                            </Paper>
                                        </Stack>
                                    </Box>
                                </Fade>
                            ))}
                            {loading && (
                                <Fade in timeout={500}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'emerald.50', borderRadius: 0 }}>
                                                <Sparkles size={16} color="#10b981" />
                                            </Avatar>
                                            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                                <Stack direction="row" spacing={1}>
                                                    <Box sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: 0, animation: 'bounce 1s infinite' }} />
                                                    <Box sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: 0, animation: 'bounce 1s infinite', animationDelay: '0.2s' }} />
                                                    <Box sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: 0, animation: 'bounce 1s infinite', animationDelay: '0.4s' }} />
                                                </Stack>
                                            </Paper>
                                        </Stack>
                                    </Box>
                                </Fade>
                            )}
                            <div ref={messagesEndRef} />
                        </Stack>
                    </Box>

                    {/* Input Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                        <TextField
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Bir şeyler yazın veya soru sorun..."
                            disabled={loading}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton
                                            type="submit"
                                            disabled={!input.trim() || loading}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                borderRadius: 0,
                                                '&:hover': { bgcolor: 'primary.dark' },
                                                '&.Mui-disabled': { bgcolor: 'grey.100', color: 'grey.400' }
                                            }}
                                        >
                                            <Send size={18} />
                                        </IconButton>
                                    ),
                                    sx: { borderRadius: 0, py: 1 }
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.disabled', fontWeight: 700 }}>
                            AI asistanı bazen hatalı öneriler sunabilir. Her zaman güvenilir bir sağlık profesyoneline danışın.
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Recommendations Sidebar */}
            {recommendations.length > 0 && (
                <Grid size={{ xs: 12, lg: 5 }} sx={{ height: '100%', minHeight: 0 }}>
                    <Fade in timeout={800} style={{ height: '100%' }}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 0 }}>
                                    <Sparkles size={20} color="white" />
                                </Avatar>
                                <Typography variant="h4" sx={{ textTransform: 'uppercase', letterSpacing: '0.02em', flex: 1 }}>Önerilen Ürünler</Typography>
                                <Chip label={`${recommendations.length} Ürün`} size="small" sx={{ fontWeight: 900, bgcolor: 'grey.100' }} />
                            </Stack>

                            <Box sx={{ flex: 1, overflowY: 'auto', pr: 2, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 } }}>
                                <Stack spacing={3}>
                                    {recommendations.map((product) => (
                                        <ProductCard key={product.id} product={product} compact />
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Fade>
                </Grid>
            )}
        </Grid>
    );
};
