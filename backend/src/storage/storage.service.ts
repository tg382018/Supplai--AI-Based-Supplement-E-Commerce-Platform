import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
    private minioClient: Minio.Client;
    private bucket: string;
    private readonly logger = new Logger(StorageService.name);

    constructor(private configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('minio.endpoint') || 'localhost',
            port: this.configService.get<number>('minio.port') || 9000,
            useSSL: this.configService.get<boolean>('minio.useSSL') || false,
            accessKey: this.configService.get<string>('minio.accessKey') || 'minioadmin',
            secretKey: this.configService.get<string>('minio.secretKey') || 'minioadmin',
        });
        this.bucket = this.configService.get<string>('minio.bucket') || 'supplai-images';
    }

    async onModuleInit() {
        await this.ensureBucketExists();
    }

    private async ensureBucketExists() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucket);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucket);

                // Set public read policy
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: '*',
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucket}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(policy));

                this.logger.log(`Bucket ${this.bucket} created successfully`);
            }
        } catch (error: any) {
            this.logger.error(`Error creating bucket: ${error.message}`);
        }
    }

    async uploadFile(file: { originalname: string; buffer: Buffer; size: number; mimetype: string }, folder = 'products') {
        const ext = file.originalname.split('.').pop();
        const filename = `${folder}/${uuidv4()}.${ext}`;

        await this.minioClient.putObject(
            this.bucket,
            filename,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype },
        );

        const endpoint = this.configService.get<string>('minio.endpoint') || 'localhost';
        const port = this.configService.get<number>('minio.port') || 9000;
        const useSSL = this.configService.get<boolean>('minio.useSSL') || false;
        const protocol = useSSL ? 'https' : 'http';

        return {
            filename,
            url: `${protocol}://${endpoint}:${port}/${this.bucket}/${filename}`,
        };
    }

    async deleteFile(filename: string) {
        try {
            await this.minioClient.removeObject(this.bucket, filename);
            return { deleted: true };
        } catch (error: any) {
            this.logger.error(`Error deleting file: ${error.message}`);
            return { deleted: false, error: error.message };
        }
    }

    async getSignedUrl(filename: string, expirySeconds = 3600) {
        return this.minioClient.presignedGetObject(this.bucket, filename, expirySeconds);
    }
}
