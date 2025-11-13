import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { SubscriptionORMEntity } from '../../../subscriptions/infrastructure/orm/subscription.orm-entity';

@Entity('users')
export class UserORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  stripeCustomerId?: string;

  @OneToMany(() => SubscriptionORMEntity, (subscription) => subscription.user)
  subscriptions?: SubscriptionORMEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
