import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Stack,
    Button
} from '@mui/material';
// import { ShoppingBag } from 'lucide-react';

export const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 10, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box
                            component="img"
                            src="/logosupplai.png"
                            alt="Supplai"
                            sx={{ height: 50 }}
                        />
                    </Box>

                    <Stack direction="row" spacing={6}>
                        <Button component={RouterLink} to="/products" sx={{ fontWeight: 800, color: 'text.secondary' }}>Mağaza</Button>
                        <Button component={RouterLink} to="/ai-advisor" sx={{ fontWeight: 800, color: 'text.secondary' }}>AI Asistan</Button>
                    </Stack>

                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'grey.400' }}>
                        © 2026 Supplai Health. Tüm hakları saklıdır.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};
