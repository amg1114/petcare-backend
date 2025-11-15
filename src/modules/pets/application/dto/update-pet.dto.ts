import { IsOptional } from 'class-validator';

import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

import { IsValidPetName } from '@modules/pets/infrastructure/validators/pet-name.validator';
import { IsValidPetBirth } from '@modules/pets/infrastructure/validators/pet-birth.validator';
import { IsValidPetBreed } from '@modules/pets/infrastructure/validators/pet-breed.validator';
import { IsValidPetNotes } from '@modules/pets/infrastructure/validators/pet-notes.validator';
import { IsValidPetPhoto } from '@modules/pets/infrastructure/validators/pet-photo.validator';
import { IsValidPetWeight } from '@modules/pets/infrastructure/validators/pet-weight.validator';
import { IsValidPetSpecies } from '@modules/pets/infrastructure/validators/pet-species.validator';

@ApiSchema({
  description: 'Data Transfer Object for updating a pet in the system',
})
export class UpdatePetDto {
  @ApiPropertyOptional({
    description: 'The name of the pet',
    example: 'Max',
  })
  @IsValidPetName()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The species of the pet',
    enum: PetSpecies,
    example: PetSpecies.DOG,
  })
  @IsValidPetSpecies()
  @IsOptional()
  species?: PetSpecies;

  @ApiPropertyOptional({
    description: 'The breed of the pet',
    example: 'Golden Retriever',
  })
  @IsValidPetBreed()
  @IsOptional()
  breed?: string;

  @ApiPropertyOptional({
    description: 'The birth date of the pet',
    type: Date,
    example: '2020-01-15',
  })
  @IsValidPetBirth()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({
    description: 'The weight of the pet in kilograms',
    type: Number,
    example: 25.5,
  })
  @IsValidPetWeight()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    description: 'URL or path to the pet photo',
    type: String,
    example: 'https://example.com/photos/pet.jpg',
  })
  @IsValidPetPhoto()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the pet',
    type: String,
    example: 'Friendly with children, allergic to chicken',
  })
  @IsValidPetNotes()
  @IsOptional()
  notes?: string;
}
