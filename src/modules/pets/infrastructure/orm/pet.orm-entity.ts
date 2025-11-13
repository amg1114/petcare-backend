import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

import { UserORMEntity } from '@modules/users/infrastructure/orm/user.orm-entity';

@Entity('pets')
export class PetORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PetSpecies })
  species: PetSpecies;

  @Column({ type: 'enum', enum: PetSpecies })
  breed: string;

  @Column({ type: 'date' })
  bornDate: Date;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight: number | null;

  @Column({ nullable: true })
  photo: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserORMEntity, (owner) => owner.pets, { eager: true })
  owner: UserORMEntity;

  @DeleteDateColumn()
  deletedAt?: Date;
}
