import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreatePetDto } from '@modules/pets/application/dto/create-pet.dto';
import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

export function ApiCreatePet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new pet',
      description:
        'Creates a new pet for the authenticated user. Requires an active BASIC subscription.',
    }),
    ApiBody({
      type: CreatePetDto,
      description: 'Pet information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Pet successfully created',
      type: PetResponseDTO,
    })
  );
}
