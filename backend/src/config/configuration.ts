export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    minio: {
        endpoint: process.env.MINIO_ENDPOINT || 'localhost',
        publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT || 'localhost',
        port: parseInt(process.env.MINIO_PORT ?? '9000', 10),
        accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        bucket: process.env.MINIO_BUCKET || 'supplai-images',
        useSSL: process.env.MINIO_USE_SSL === 'true',
    },
    ai: {
        provider: process.env.AI_PROVIDER || 'openai',
        openaiKey: process.env.OPENAI_API_KEY,
        geminiKey: process.env.GEMINI_API_KEY,
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT ?? '587', 10),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        from: process.env.MAIL_FROM,
        secure: process.env.MAIL_SECURE === 'true',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
});
