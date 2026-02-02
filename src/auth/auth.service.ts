import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException } from '@nestjs/common';
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

  // 1️⃣ Create user FIRST
  const user = this.userRepo.create({
    email,
    passwordHash,
  });

  const savedUser = await this.userRepo.save(user);

  // 2️⃣ Create credits WITH userId
  const credits = this.userCreditRepo.create({
    userId: savedUser.id, // ✅ THIS IS THE FIX
    creditBalance: 0,
    freeGenerationsUsed: 0,
  });

  await this.userCreditRepo.save(credits);

  return { message: 'Signup successful' };
}

async login(email: string, password: string) {
  const user = await this.userRepo.findOne({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = this.jwtService.sign(payload);

  return {
    message: 'Login successful',
    accessToken,
  };
}

                                                                                                        }
                                                                                                        