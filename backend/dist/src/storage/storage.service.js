"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = __importStar(require("minio"));
const uuid_1 = require("uuid");
let StorageService = StorageService_1 = class StorageService {
    configService;
    minioClient;
    bucket;
    logger = new common_1.Logger(StorageService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('minio.endpoint') || 'localhost',
            port: this.configService.get('minio.port') || 9000,
            useSSL: this.configService.get('minio.useSSL') || false,
            accessKey: this.configService.get('minio.accessKey') || 'minioadmin',
            secretKey: this.configService.get('minio.secretKey') || 'minioadmin',
        });
        this.bucket = this.configService.get('minio.bucket') || 'supplai-images';
    }
    async onModuleInit() {
        await this.ensureBucketExists();
    }
    async ensureBucketExists() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucket);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucket);
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
        }
        catch (error) {
            this.logger.error(`Error creating bucket: ${error.message}`);
        }
    }
    async uploadFile(file, folder = 'products') {
        const ext = file.originalname.split('.').pop();
        const filename = `${folder}/${(0, uuid_1.v4)()}.${ext}`;
        await this.minioClient.putObject(this.bucket, filename, file.buffer, file.size, { 'Content-Type': file.mimetype });
        const endpoint = this.configService.get('minio.endpoint') || 'localhost';
        const port = this.configService.get('minio.port') || 9000;
        const useSSL = this.configService.get('minio.useSSL') || false;
        const protocol = useSSL ? 'https' : 'http';
        return {
            filename,
            url: `${protocol}://${endpoint}:${port}/${this.bucket}/${filename}`,
        };
    }
    async deleteFile(filename) {
        try {
            await this.minioClient.removeObject(this.bucket, filename);
            return { deleted: true };
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`);
            return { deleted: false, error: error.message };
        }
    }
    async getSignedUrl(filename, expirySeconds = 3600) {
        return this.minioClient.presignedGetObject(this.bucket, filename, expirySeconds);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map