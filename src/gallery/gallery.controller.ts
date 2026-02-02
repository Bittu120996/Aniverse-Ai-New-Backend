import { Controller, Get } from '@nestjs/common';
import { GenerationsService } from '../generations/generations.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly generationsService: GenerationsService,
  ) {}

  // 🌍 PUBLIC GALLERY (NO AUTH)
  @Get('public')
  async getPublicGallery() {
    return this.generationsService.getPublicGallery();
  }
}
