import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StorageService implements OnModuleInit {
    private configService;
    private minioClient;
    private bucket;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucketExists;
    uploadFile(file: {
        originalname: string;
        buffer: Buffer;
        size: number;
        mimetype: string;
    }, folder?: string): Promise<{
        filename: string;
        url: string;
    }>;
    deleteFile(filename: string): Promise<{
        deleted: boolean;
        error?: undefined;
    } | {
        deleted: boolean;
        error: any;
    }>;
    getSignedUrl(filename: string, expirySeconds?: number): Promise<string>;
}
