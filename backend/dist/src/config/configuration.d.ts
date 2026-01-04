declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        publishableKey: string | undefined;
    };
    minio: {
        endpoint: string;
        port: number;
        accessKey: string;
        secretKey: string;
        bucket: string;
        useSSL: boolean;
    };
    ai: {
        provider: string;
        openaiKey: string | undefined;
        geminiKey: string | undefined;
    };
    frontendUrl: string;
};
export default _default;
