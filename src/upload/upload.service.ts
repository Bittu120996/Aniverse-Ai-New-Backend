import { Injectable, BadRequestException } from '@nestjs/common';
import * as faceapi from '@vladmandic/face-api';
import * as canvas from 'canvas';
import type { Express } from 'express';
import { UploadStore } from './upload.store';


const { Canvas, Image, ImageData } = canvas as any;

// Patch face-api for Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

@Injectable()
export class UploadService {
  private modelsLoaded = false;

  private async loadModels() {
    if (this.modelsLoaded) return;

    await faceapi.nets.tinyFaceDetector.loadFromDisk(
      'src/upload/models',
    );

    this.modelsLoaded = true;
  }

  async processFaceImage(
  file: Express.Multer.File,
  userId: string,
) {
  if (!file || !file.buffer) {
    throw new BadRequestException('Invalid image file');
  }

  // TEMP: skip face-api in production
  const base64Image = file.buffer.toString('base64');

  UploadStore.set(userId, {
    base64: base64Image,
    mimeType: file.mimetype,
    createdAt: Date.now(),
  });

  return {
    message: 'Face image uploaded successfully',
  };
}

}

