import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user_credits')
export class UserCredit {
  @PrimaryGeneratedColumn('uuid')
    id: string;

      @Column({ unique: true })
        userId: string;

          @Column({ default: 0 })
            creditBalance: number;

              @Column({ default: 0 })
                freeGenerationsUsed: number;

                  @UpdateDateColumn()
                    updatedAt: Date;
                    }