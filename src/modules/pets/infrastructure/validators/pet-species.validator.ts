import { IsEnum } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

export function IsValidPetSpecies() {
  return applyDecorators(
    IsEnum(PetSpecies, {
      message: `Pet species should be one of ${Object.values(PetSpecies).join(', ')}`,
    })
  );
}
