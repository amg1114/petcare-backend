import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { UserType } from '../../domain/value-objects/user-type.enum';
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

  @Column({ type: 'enum', enum: UserType, default: UserType.BASIC })
  type: UserType;

  @Column({ unique: true, nullable: true })
  stripeCustomerId?: string;

  @OneToMany(() => SubscriptionORMEntity, (subscription) => subscription.user)
  subscriptions?: SubscriptionORMEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
