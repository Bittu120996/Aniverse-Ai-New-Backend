import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { Generation } from '../generations/generation.entity';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { UserCredit } from '../credits/credit.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
    host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD, // ✅ now guaranteed string
            database: process.env.DB_NAME,
              ssl: false,
                entities: [
                              User,
                              UserCredit,
                              Generation,
                          ],
                  migrations: ['src/database/migrations/*.ts'],
                  });