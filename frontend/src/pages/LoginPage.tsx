import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, clearError } from '../store/slices';

interface LoginForm {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        dispatch(clearError());
        const result = await dispatch(login(data));
        if (login.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <span className="text-3xl">💊</span>
                        <span className="text-2xl font-bold gradient-text">Supplai</span>
                    </Link>
                    <h1 className="text-2xl font-bold mt-6">Giriş Yap</h1>
                    <p className="text-[var(--text-muted)] mt-2">Hesabınıza giriş yapın</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-lg bg-[var(--error)]/20 border border-[var(--error)]/50 text-[var(--error)]">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email gerekli',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Geçersiz email adresi',
                                },
                            })}
                            className="input"
                            placeholder="ornek@email.com"
                        />
                        {errors.email && (
                            <p className="text-[var(--error)] text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Şifre</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Şifre gerekli',
                                minLength: { value: 6, message: 'Şifre en az 6 karakter olmalı' },
                            })}
                            className="input"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-[var(--error)] text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <p className="text-center text-[var(--text-muted)] mt-6">
                    Hesabınız yok mu?{' '}
                    <Link to="/register" className="text-[var(--primary)] hover:underline">
                        Kayıt Ol
                    </Link>
                </p>
            </div>
        </div>
    );
};
