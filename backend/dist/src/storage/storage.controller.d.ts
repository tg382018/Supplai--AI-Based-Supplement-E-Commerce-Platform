import { StorageService } from './storage.service';
interface UploadedFileType {
    originalname: string;
    buffer: Buffer;
    size: number;
    mimetype: string;
}
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: UploadedFileType): Promise<{
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
}
export {};
