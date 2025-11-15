import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

export interface PetEntityProps {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  weight?: number;
  photo?: string;
  notes?: string;
  owner: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PetEntity {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  weight?: number;
  photo?: string;
  notes?: string;
  owner: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: PetEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.species = props.species;
    this.breed = props.breed;
    this.birthDate = props.birthDate;
    this.weight = props.weight;
    this.photo = props.photo;
    this.notes = props.notes;
    this.owner = props.owner;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(data: Omit<PetEntityProps, 'id' | 'createdAt' | 'updatedAt'>) {
    return new PetEntity({
      ...data,
      id: undefined,
      createdAt: new Date(),
      updatedAt: undefined,
    });
  }

  static reconstitute(props: PetEntityProps) {
    if (!props.id) {
      throw new Error('ID is required to reconstitute a pet');
    }

    return new PetEntity(props);
  }

  public isOwner(owner: PetEntity['owner']) {
    return this.owner.id === owner.id;
  }
}
