import { AiChat } from '../components';
import { Sparkles } from 'lucide-react';

export const AiAdvisorPage = () => {
    return (
        <div className="pt-12 pb-24 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-primary text-sm font-bold mb-4 border border-emerald-100">
                        <Sparkles className="w-4 h-4" />
                        <span>Kişiselleştirilmiş Öneriler</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">AI Supplement Asistanı</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Fiziksel verilerinizi ve hedeflerinizi paylaşın, saniyeler içinde size özel supplement kürünü oluşturalım.
                    </p>
                </div>

                <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <AiChat />
                </div>
            </div>
        </div>
    );
};
