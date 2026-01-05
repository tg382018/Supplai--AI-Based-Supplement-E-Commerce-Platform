import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { verify, clearError } from '../store/slices/authSlice';

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
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full glass-card p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">E-posta Doğrulama</h1>
                    <p className="text-gray-400">
                        Lütfen <span className="text-primary font-semibold">{email}</span> adresine gönderilen 6 haneli kodu girin.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                            Doğrulama Kodu
                        </label>
                        <input
                            id="code"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            {...register('code', {
                                required: 'Doğrulama kodu gereklidir',
                                minLength: { value: 6, message: 'Kod 6 haneli olmalıdır' },
                                maxLength: { value: 6, message: 'Kod 6 haneli olmalıdır' },
                                pattern: { value: /^[0-9]+$/, message: 'Sadece rakam girebilirsiniz' },
                            })}
                            className={`w-full bg-slate-800/50 border ${errors.code ? 'border-red-500' : 'border-slate-700'
                                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-2xl tracking-widest`}
                        />
                        {errors.code && (
                            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Doğrula ve Giriş Yap'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Kod gelmedi mi?{' '}
                        <button className="text-primary hover:underline font-medium">
                            Tekrar Gönder
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

