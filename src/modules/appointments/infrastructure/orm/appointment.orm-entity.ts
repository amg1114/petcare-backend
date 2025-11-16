import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { UserORMEntity } from '@modules/users/infrastructure/orm/user.orm-entity';

@Entity('appointments')
export class AppointmentORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PetORMEntity, { eager: true })
  @JoinColumn()
  pet: PetORMEntity;

  @Column('timestamptz')
  scheduledAt: Date;

  @Column('enum', { enum: ServiceType })
  serviceType: ServiceType;

  @ManyToOne(() => UserORMEntity, (user) => user.appointments)
  veterinarian: UserORMEntity;

  @Column('numeric')
  duration: number;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt?: Date;
}
