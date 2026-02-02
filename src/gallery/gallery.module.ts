import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GenerationsModule } from '../generations/generations.module';

@Module({
  imports: [GenerationsModule], // ✅ REQUIRED
  controllers: [GalleryController],
})
export class GalleryModule {}
