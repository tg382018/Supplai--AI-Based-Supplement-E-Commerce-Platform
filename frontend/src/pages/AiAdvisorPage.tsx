import { AiChat } from '../components';

export const AiAdvisorPage = () => {
    return (
        <div className="pt-8 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-2">AI Supplement Asistanı</h1>
                    <p className="text-[var(--text-muted)]">
                        Sağlık hedeflerinizi anlatın, size en uygun supplementleri önerelim.
                    </p>
                </div>
                <AiChat />
            </div>
        </div>
    );
};
