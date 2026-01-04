import {
    Controller,
    Post,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { StorageService } from './storage.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth';

interface UploadedFileType {
    originalname: string;
    buffer: Buffer;
    size: number;
    mimetype: string;
}

@ApiTags('storage')
@Controller('api/storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @ApiOperation({ summary: 'Upload a file (Admin only)' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
                ],
            }),
        )
        file: UploadedFileType,
    ) {
        return this.storageService.uploadFile(file);
    }

    @Delete(':filename')
    @ApiOperation({ summary: 'Delete a file (Admin only)' })
    deleteFile(@Param('filename') filename: string) {
        return this.storageService.deleteFile(filename);
    }
}
