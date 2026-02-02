import { Controller, Post, Get, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerationsService } from './generations.service';
import { Param, Delete } from '@nestjs/common';

@Controller('generate')
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  // 🔐 PROTECTED GENERATION
  @UseGuards(JwtAuthGuard)
  @Post()
  async generate(
    @Req() req: any,
    @Query('style') style?: string,
  ) {
    return this.generationsService.generate(
      req.user.userId,
      style || 'jujutsu-kaisen',
    );
  }

  // 🌍 PUBLIC GALLERY
  @Get('gallery')
  async publicGallery() {
    return this.generationsService.getPublicGallery();
  }

  // 👤 MY GENERATIONS
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myGenerations(@Req() req: any) {
    return this.generationsService.getMyGenerations(req.user.userId);
  }
    // ⬇️ OWNER-ONLY DOWNLOAD
@UseGuards(JwtAuthGuard)
@Get(':id/download')
async download(
  @Req() req: any,
  @Param('id') id: string,
) {
  return this.generationsService.downloadGeneration(req.user.userId, id);
}

// 🗑 OWNER-ONLY DELETE
@UseGuards(JwtAuthGuard)
@Delete(':id')
async delete(
  @Req() req: any,
  @Param('id') id: string,
) {
  return this.generationsService.deleteGeneration(req.user.userId, id);
}

}
