import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredit } from './credit.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(UserCredit)
    private readonly creditRepo: Repository<UserCredit>,
  ) {}

  async canGenerate(userId: string): Promise<boolean> {
    const credit = await this.creditRepo.findOne({ where: { userId } });

    if (!credit) return false;

    if (credit.freeGenerationsUsed < 2) return true;
    if (credit.creditBalance > 0) return true;

    return false;
  }

  async consumeCredit(userId: string) {
    const credit = await this.creditRepo.findOne({ where: { userId } });

    if (!credit) {
      throw new ForbiddenException('Credits not initialized');
    }

    if (credit.freeGenerationsUsed < 2) {
      credit.freeGenerationsUsed += 1;
    } else if (credit.creditBalance > 0) {
      credit.creditBalance -= 1;
    } else {
      throw new ForbiddenException('No credits available');
    }

    await this.creditRepo.save(credit);
  }

  async getCredits(userId: string) {
    return this.creditRepo.findOne({ where: { userId } });
  }
}
