import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Stack,
    TextField,
    Button,
    Paper,
    Link,
    Alert,
    CircularProgress,
    Fade,
    Avatar
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { verify, clearError } from '../store/slices/authSlice';
import { Mail, ShieldCheck, ArrowRight } from 'lucide-react';

interface VerifyFormData {
    code: string;
}

export const VerifyPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const email = new URLSearchParams(location.search).get('email');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyFormData>();

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
        if (isAuthenticated) {
            navigate('/');
        }
        return () => {
            dispatch(clearError());
        };
    }, [email, isAuthenticated, navigate, dispatch]);

    const onSubmit = async (data: VerifyFormData) => {
        if (email) {
            const resultAction = await dispatch(verify({ email, code: data.code }));
            if (verify.fulfilled.match(resultAction)) {
                navigate('/');
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                pt: 12,
                pb: 8
            }}
        >
            <Container maxWidth="xs">
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: 10,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.06)',
                            bgcolor: 'white'
                        }}
                    >
                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'emerald.50',
                                    mx: 'auto',
                                    mb: 3,
                                    borderRadius: 4
                                }}
                            >
                                <ShieldCheck size={40} color="#10b981" />
                            </Avatar>
                            <Typography variant="h3" sx={{ mb: 1.5 }}>E-posta Doğrulama</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                                Lütfen <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>{email}</Box> adresine gönderilen 6 haneli kodu girin.
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 700 }}>
                                        {error}
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    label="Doğrulama Kodu"
                                    placeholder="123456"
                                    {...register('code', {
                                        required: 'Doğrulama kodu gereklidir',
                                        minLength: { value: 6, message: 'Kod 6 haneli olmalıdır' },
                                        maxLength: { value: 6, message: 'Kod 6 haneli olmalıdır' },
                                        pattern: { value: /^[0-9]+$/, message: 'Sadece rakam girebilirsiniz' },
                                    })}
                                    error={!!errors.code}
                                    helperText={errors.code?.message}
                                    slotProps={{
                                        input: {
                                            sx: {
                                                borderRadius: 4,
                                                textAlign: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 900,
                                                letterSpacing: '0.5em',
                                                '& input': { textAlign: 'center', ml: 2 }
                                            }
                                        }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    endIcon={!loading && <ArrowRight size={20} />}
                                    sx={{
                                        py: 2,
                                        borderRadius: 4,
                                        fontSize: '1.1rem',
                                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Doğrula ve Giriş Yap'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Kod gelmedi mi?{' '}
                                <Button
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 900,
                                        textTransform: 'none',
                                        p: 0,
                                        minWidth: 'auto',
                                        '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
                                    }}
                                >
                                    Tekrar Gönder
                                </Button>
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};
