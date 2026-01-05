import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Stack,
    Button
} from '@mui/material';
import { ShoppingBag } from 'lucide-react';

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
                        <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5, display: 'flex' }}>
                            <ShoppingBag size={24} color="white" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>Supp<Box component="span" sx={{ color: 'primary.main' }}>lai</Box></Typography>
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
