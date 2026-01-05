import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Fade,
    Stack,
    Divider,
    IconButton,
    Avatar
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMyTickets, fetchTicketById, createTicket, sendMessage, clearCurrentTicket } from '../store/slices';
import { Footer } from '../components';
import { Plus, Send, ArrowLeft, MessageCircle, Clock } from 'lucide-react';

export const SupportPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { tickets, currentTicket, loading } = useAppSelector((state) => state.support);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        dispatch(fetchMyTickets());
    }, [dispatch, isAuthenticated, navigate]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentTicket?.messages]);

    const handleCreateTicket = async () => {
        if (!newSubject.trim() || !newMessage.trim()) return;
        await dispatch(createTicket({ subject: newSubject, message: newMessage }));
        setCreateDialogOpen(false);
        setNewSubject('');
        setNewMessage('');
    };

    const handleSelectTicket = (ticketId: string) => {
        dispatch(fetchTicketById(ticketId));
    };

    const handleSendMessage = async () => {
        if (!replyMessage.trim() || !currentTicket) return;
        await dispatch(sendMessage({ ticketId: currentTicket.id, content: replyMessage }));
        setReplyMessage('');
    };

    const handleBackToList = () => {
        dispatch(clearCurrentTicket());
    };

    if (!isAuthenticated) return null;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
                <Fade in timeout={600}>
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                                    Müşteri Hizmetleri
                                </Typography>
                                <Typography variant="h2">Destek Taleplerim</Typography>
                            </Box>
                            {!currentTicket && (
                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={20} />}
                                    onClick={() => setCreateDialogOpen(true)}
                                    sx={{ borderRadius: 0, px: 4, py: 1.5, fontWeight: 800 }}
                                >
                                    Yeni Talep
                                </Button>
                            )}
                        </Stack>

                        {loading && !currentTicket ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : currentTicket ? (
                            // Chat View
                            <Paper elevation={0} sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                                <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <IconButton onClick={handleBackToList} sx={{ bgcolor: 'white' }}>
                                            <ArrowLeft size={20} />
                                        </IconButton>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>{currentTicket.subject}</Typography>
                                            <Chip
                                                label={currentTicket.status === 'OPEN' ? 'Açık' : 'Kapalı'}
                                                color={currentTicket.status === 'OPEN' ? 'success' : 'default'}
                                                size="small"
                                                sx={{ fontWeight: 700, mt: 0.5 }}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ height: 400, overflowY: 'auto', p: 3, bgcolor: 'white' }}>
                                    <Stack spacing={2}>
                                        {currentTicket.messages?.map((msg) => (
                                            <Box
                                                key={msg.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                                                }}
                                            >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        maxWidth: '70%',
                                                        borderRadius: 2,
                                                        bgcolor: msg.sender === 'USER' ? 'primary.main' : 'grey.100',
                                                        color: msg.sender === 'USER' ? 'white' : 'text.primary',
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{msg.content}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                                                        {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </Stack>
                                </Box>

                                {currentTicket.status === 'OPEN' && (
                                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                fullWidth
                                                placeholder="Mesajınızı yazın..."
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleSendMessage}
                                                disabled={!replyMessage.trim()}
                                                sx={{ borderRadius: 2, px: 3 }}
                                            >
                                                <Send size={20} />
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}
                            </Paper>
                        ) : tickets.length === 0 ? (
                            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 0, border: '1px solid', borderColor: 'divider' }}>
                                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.100', mx: 'auto', mb: 3 }}>
                                    <MessageCircle size={40} color="#94a3b8" />
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Henüz destek talebiniz yok</Typography>
                                <Typography color="text.secondary" sx={{ mb: 4 }}>
                                    Sorularınız veya sorunlarınız için yeni bir destek talebi oluşturabilirsiniz.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={20} />}
                                    onClick={() => setCreateDialogOpen(true)}
                                    sx={{ borderRadius: 0, px: 4, py: 1.5, fontWeight: 800 }}
                                >
                                    Yeni Talep Oluştur
                                </Button>
                            </Paper>
                        ) : (
                            <Paper elevation={0} sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}>
                                <List disablePadding>
                                    {tickets.map((ticket, index) => (
                                        <Box key={ticket.id}>
                                            {index > 0 && <Divider />}
                                            <ListItemButton onClick={() => handleSelectTicket(ticket.id)} sx={{ p: 3 }}>
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{ticket.subject}</Typography>
                                                            <Chip
                                                                label={ticket.status === 'OPEN' ? 'Açık' : 'Kapalı'}
                                                                color={ticket.status === 'OPEN' ? 'success' : 'default'}
                                                                size="small"
                                                                sx={{ fontWeight: 700 }}
                                                            />
                                                        </Stack>
                                                    }
                                                    secondary={
                                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                                            <Clock size={14} />
                                                            <Typography variant="caption">
                                                                {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                />
                                            </ListItemButton>
                                        </Box>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Box>
                </Fade>
            </Container>
            <Footer />

            {/* Create Ticket Dialog */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Yeni Destek Talebi</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Konu"
                            fullWidth
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Ör: Sipariş ile ilgili sorun"
                        />
                        <TextField
                            label="Mesajınız"
                            fullWidth
                            multiline
                            rows={4}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Sorununuzu veya talebinizi detaylı açıklayın..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCreateDialogOpen(false)}>İptal</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateTicket}
                        disabled={!newSubject.trim() || !newMessage.trim()}
                        sx={{ borderRadius: 0, fontWeight: 800 }}
                    >
                        Talep Oluştur
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
