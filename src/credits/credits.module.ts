import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { UserCredit } from './credit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredit])],
  providers: [CreditsService],
  controllers: [CreditsController],
  exports: [CreditsService], // ✅ ADD THIS
})
export class CreditsModule {}
