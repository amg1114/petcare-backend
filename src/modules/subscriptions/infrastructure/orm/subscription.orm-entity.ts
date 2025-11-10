import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserORMEntity } from '../../../users/infrastructure/orm/user.orm-entity';
import { SubscriptionPlan } from '../../domain/value-objects/subscription-plan.vo';
import { SubscriptionStatus } from '../../domain/value-objects/subscription-status.vo';

@Entity('subscriptions')
export class SubscriptionORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserORMEntity, (user) => user.subscriptions, {
    eager: true,
  })
  user: UserORMEntity;

  @Column({ type: 'enum', enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column({ unique: true })
  stripeSubscriptionId: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column({ type: 'boolean', default: false })
  cancelAtEnd: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
