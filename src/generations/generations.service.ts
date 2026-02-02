
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditsService } from '../credits/credits.service';
import { Generation } from './generation.entity';
import { AiService } from '../ai/ai.service';
import { UploadStore } from '../upload/upload.store';


@Injectable()
export class GenerationsService {
  constructor(
    private readonly creditsService: CreditsService,
    private readonly aiService: AiService,
    @InjectRepository(Generation)
    private readonly generationRepo: Repository<Generation>,
  ) {}

  // 🔮 CREATE GENERATION
  async generate(userId: string, animeStyle: string) {
    console.log('TEST_FACE_BASE64 exists:', !!process.env.TEST_FACE_BASE64);
    const canGenerate = await this.creditsService.canGenerate(userId);

    if (!canGenerate) {
      throw new ForbiddenException('No credits available');
    }

    // 🔗 AI PIPELINE (mock for now, real AI next)
  const aiResult = await this.aiService.generateAnimeImage({
      userImageUrl: process.env.TEST_FACE_BASE64!,
      animeStyle,
    });

    const generation = await this.generationRepo.save({
      userId,
      imageUrl: aiResult.imageUrl,
      animeStyle,
      isPublic: true,
    });
        const tempImage = UploadStore.get(userId);

    if (!tempImage) {
      throw new ForbiddenException('No uploaded face image found');
    }

    await this.creditsService.consumeCredit(userId);

    return generation;
  }

  // 🌍 PUBLIC GALLERY (SANITIZED)
  async getPublicGallery() {
    return this.generationRepo.find({
      select: ['imageUrl', 'animeStyle', 'createdAt'],
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
    });
  }

  // 👤 USER GALLERY
  async getMyGenerations(userId: string) {
    return this.generationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // ⬇️ OWNER-ONLY DOWNLOAD
  async downloadGeneration(userId: string, generationId: string) {
    const gen = await this.generationRepo.findOne({
      where: { id: generationId },
    });

    if (!gen) {
      throw new NotFoundException('Generation not found');
    }

    if (gen.userId !== userId) {
      throw new ForbiddenException('Not allowed to download this image');
    }

    return {
      imageUrl: gen.imageUrl,
      animeStyle: gen.animeStyle,
      createdAt: gen.createdAt,
    };
  }

  // 🗑 OWNER-ONLY DELETE
  async deleteGeneration(userId: string, generationId: string) {
    const gen = await this.generationRepo.findOne({
      where: { id: generationId },
    });

    if (!gen) {
      throw new NotFoundException('Generation not found');
    }

    if (gen.userId !== userId) {
      throw new ForbiddenException('Not allowed to delete this image');
    }

    await this.generationRepo.delete({ id: generationId });

    return { message: 'Generation deleted successfully' };
  }
}
