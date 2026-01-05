import { Box, Container, Typography, Fade, Chip } from '@mui/material';
import { AiChat, Footer } from '../components';
import { Sparkles } from 'lucide-react';

export const AiAdvisorPage = () => {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 10, textAlign: 'center' }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Chip
                                icon={<Sparkles size={16} />}
                                label="Kişiselleştirilmiş Öneriler"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    mb: 4,
                                    fontWeight: 800,
                                    borderRadius: 10,
                                    bgcolor: 'emerald.50',
                                    borderColor: 'emerald.100',
                                    color: 'primary.main',
                                    py: 2
                                }}
                            />
                            <Typography variant="h1" sx={{ mb: 3, letterSpacing: '-0.02em' }}>
                                AI Supplement Asistanı
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.25rem', lineHeight: 1.8 }}>
                                Fiziksel verilerinizi ve hedeflerinizi paylaşın, saniyeler içinde size özel supplement kürünü oluşturalım.
                            </Typography>
                        </Box>
                    </Fade>
                </Box>

                <Fade in timeout={1200}>
                    <Box>
                        <AiChat />
                    </Box>
                </Fade>
            </Container>
            <Footer />
        </Box>
    );
};
