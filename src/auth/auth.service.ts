import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UserCredit } from '../credits/credit.entity';

@Injectable()
export class AuthService {
                constructor(
                @InjectRepository(User)
                private readonly userRepo: Repository<User>,

                @InjectRepository(UserCredit)
                private readonly creditRepo: Repository<UserCredit>,

                private readonly jwtService: JwtService,
                ) {}


    async signup(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepo.save({
      email,
      passwordHash,
    });

    await this.creditRepo.save({
      userId: user.id,
      creditBalance: 0,
      freeGenerationsUsed: 0,
    });

    return { message: 'Signup successful' };
  }


 async login(email: string, password: string) {
  const user = await this.userRepo.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { sub: user.id, email: user.email };

  return {
    message: 'Login successful',
    accessToken: this.jwtService.sign(payload),
  };
}



                                                                                                        }
                                                                                                        