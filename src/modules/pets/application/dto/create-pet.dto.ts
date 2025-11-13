import { IsOptional } from 'class-validator';

import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

import { IsValidPetName } from '@modules/pets/infrastructure/validators/pet-name.validator';
import { IsValidPetBirth } from '@modules/pets/infrastructure/validators/pet-birth.validator';
import { IsValidPetBreed } from '@modules/pets/infrastructure/validators/pet-breed.validator';
import { IsValidPetNotes } from '@modules/pets/infrastructure/validators/pet-notes.validator';
import { IsValidPetPhoto } from '@modules/pets/infrastructure/validators/pet-photo.validator';
import { IsValidPetWeight } from '@modules/pets/infrastructure/validators/pet-weight.validator';
import { IsValidPetSpecies } from '@modules/pets/infrastructure/validators/pet-species.validator';

export class CreatePetDto {
  @IsValidPetName()
  name: string;

  @IsValidPetSpecies()
  species: PetSpecies;

  @IsValidPetBreed()
  breed: string;

  @IsValidPetBirth()
  birthDate: Date;

  @IsValidPetWeight()
  @IsOptional()
  weight?: number;

  @IsValidPetPhoto()
  @IsOptional()
  photo?: string;

  @IsValidPetNotes()
  @IsOptional()
  notes?: string;
}
