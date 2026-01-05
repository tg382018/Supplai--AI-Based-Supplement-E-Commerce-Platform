import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
    IconButton,
    InputAdornment
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();

    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        dispatch(clearError());
        const result = await dispatch(
            registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            })
        );
        if (registerUser.fulfilled.match(result)) {
            navigate(`/verify?email=${encodeURIComponent(data.email)}`);
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
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.06)',
                            bgcolor: 'white'
                        }}
                    >
                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                            <Box
                                component={RouterLink}
                                to="/"
                                sx={{
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    mb: 4
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/logosupplai.png"
                                    alt="Supplai"
                                    sx={{ height: 70 }}
                                />
                            </Box>
                            <Typography variant="h3" sx={{ mb: 1.5 }}>Aramıza Katılın</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Sağlıklı yaşam yolculuğunuza bugün başlayın
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2.5}>
                                {error && (
                                    <Alert severity="error" sx={{ fontWeight: 700 }}>
                                        {error}
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    placeholder="John Doe"
                                    {...register('name', { required: 'Ad soyad gerekli' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            ),
                                            sx: {}
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Email Adresi"
                                    placeholder="ornek@email.com"
                                    {...register('email', {
                                        required: 'Email gerekli',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Geçersiz email adresi',
                                        },
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Mail size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            ),
                                            sx: {}
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    label="Şifre"
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: 'Şifre gerekli',
                                        minLength: { value: 6, message: 'Şifre en az 6 karakter olmalı' },
                                    })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            sx: {}
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    label="Şifre Tekrar"
                                    placeholder="••••••••"
                                    {...register('confirmPassword', {
                                        required: 'Şifre tekrarı gerekli',
                                        validate: (value) => value === password || 'Şifreler eşleşmiyor',
                                    })}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            ),
                                            sx: {}
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
                                        mt: 1,
                                        fontSize: '1.1rem',
                                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Zaten hesabınız var mı?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 900,
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Giriş Yap
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};
