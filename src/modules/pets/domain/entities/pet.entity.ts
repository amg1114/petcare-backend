import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

export class PetEntity {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  bornDate: Date;
  weight?: number;
  photo?: string;
  notes?: string;
  owner: UserEntity;
}
