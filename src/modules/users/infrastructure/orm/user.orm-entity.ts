import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';

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

  @OneToMany(() => PetORMEntity, (pets) => pets.owner)
  pets: PetORMEntity[];

  @OneToMany(() => AppointmentORMEntity, (services) => services.veterinarian)
  appointments: AppointmentORMEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
