import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';
import type { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('face')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const callback = cb as any; // 🔑 THE FIX

        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(
            new BadRequestException('Only JPG/PNG images allowed'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async uploadFace(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any,
) {
  if (!file) {
    throw new BadRequestException('Image file is required');
  }

  if (!req.user || !req.user.userId) {
    throw new BadRequestException('Invalid user context');
  }

  return this.uploadService.processFaceImage(
    file,
    req.user.userId,
  );
}
}

