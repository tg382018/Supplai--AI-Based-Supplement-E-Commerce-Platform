import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Button,
    TextField,
    CircularProgress,
    Stack,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchAllTickets, fetchTicketById, sendMessage, closeTicket, clearCurrentTicket } from '../../store/slices';
import { Send, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';

export const AdminSupport = () => {
    const dispatch = useAppDispatch();
    const { tickets, currentTicket, loading } = useAppSelector((state) => state.support);
    const [replyMessage, setReplyMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchAllTickets());
    }, [dispatch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentTicket?.messages]);

    const handleSelectTicket = (ticketId: string) => {
        dispatch(fetchTicketById(ticketId));
    };

    const handleSendMessage = async () => {
        if (!replyMessage.trim() || !currentTicket) return;
        await dispatch(sendMessage({ ticketId: currentTicket.id, content: replyMessage }));
        setReplyMessage('');
    };

    const handleCloseTicket = async (ticketId: string) => {
        await dispatch(closeTicket(ticketId));
    };

    const handleBackToList = () => {
        dispatch(clearCurrentTicket());
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: '0.2em' }}>
                    Yönetim Paneli
                </Typography>
                <Typography variant="h3">Destek Talepleri</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Tickets List */}
                <Grid size={{ xs: 12, md: currentTicket ? 4 : 12 }}>
                    <Paper elevation={0} sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}>
                        <List disablePadding>
                            {loading && tickets.length === 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : tickets.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Henüz destek talebi yok.</Typography>
                                </Box>
                            ) : (
                                tickets.map((ticket, index) => (
                                    <Box key={ticket.id}>
                                        {index > 0 && <Divider />}
                                        <ListItemButton
                                            onClick={() => handleSelectTicket(ticket.id)}
                                            selected={currentTicket?.id === ticket.id}
                                            sx={{
                                                p: 2,
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.50',
                                                    borderLeft: '4px solid',
                                                    borderColor: 'primary.main'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                            {ticket.subject}
                                                        </Typography>
                                                        <Chip
                                                            label={ticket.status === 'OPEN' ? 'Açık' : 'Kapalı'}
                                                            color={ticket.status === 'OPEN' ? 'success' : 'default'}
                                                            size="small"
                                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900 }}
                                                        />
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                            {ticket.user?.name || 'Bilinmeyen Kullanıcı'}
                                                        </Typography>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                            <Clock size={12} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(ticket.updatedAt).toLocaleString('tr-TR')}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                }
                                            />
                                        </ListItemButton>
                                    </Box>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Chat View */}
                {currentTicket && (
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <IconButton onClick={handleBackToList} sx={{ display: { md: 'none' } }}>
                                            <ArrowLeft size={20} />
                                        </IconButton>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>{currentTicket.subject}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                {currentTicket.user?.name} ({currentTicket.user?.email})
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    {currentTicket.status === 'OPEN' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleCloseTicket(currentTicket.id)}
                                            startIcon={<CheckCircle2 size={16} />}
                                            sx={{ fontWeight: 800 }}
                                        >
                                            Talebi Kapat
                                        </Button>
                                    )}
                                </Stack>
                            </Box>

                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: 'white', minHeight: 400 }}>
                                <Stack spacing={2}>
                                    {currentTicket.messages?.map((msg) => (
                                        <Box
                                            key={msg.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: msg.sender === 'ADMIN' ? 'flex-end' : 'flex-start',
                                            }}
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    maxWidth: '80%',
                                                    borderRadius: 2,
                                                    bgcolor: msg.sender === 'ADMIN' ? 'primary.main' : 'grey.100',
                                                    color: msg.sender === 'ADMIN' ? 'white' : 'text.primary',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{msg.content}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                                                    {msg.sender === 'ADMIN' ? 'Siz' : currentTicket.user?.name} • {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </Stack>
                            </Box>

                            {currentTicket.status === 'OPEN' ? (
                                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            fullWidth
                                            placeholder="Cevabınızı yazın..."
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            size="small"
                                            multiline
                                            maxRows={4}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: 'white' } }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleSendMessage}
                                            disabled={!replyMessage.trim()}
                                            sx={{ borderRadius: 1, px: 3, height: 40 }}
                                        >
                                            <Send size={20} />
                                        </Button>
                                    </Stack>
                                </Box>
                            ) : (
                                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                        Bu destek talebi kapatılmıştır.
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AdminSupport;
