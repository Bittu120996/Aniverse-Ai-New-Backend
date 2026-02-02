import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';
import { CreditsModule } from '../credits/credits.module';
import { Generation } from './generation.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Generation])],
  controllers: [GenerationsController],
  providers: [GenerationsService],
  exports: [GenerationsService], // ✅ ADD THIS
})
export class GenerationsModule {}



