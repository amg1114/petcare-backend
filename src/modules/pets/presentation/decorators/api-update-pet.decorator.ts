import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UpdatePetDto } from '@modules/pets/application/dto/update-pet.dto';
import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

export function ApiUpdatePet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a pet',
      description:
        'Updates a pet for the authenticated user. Requires an active BASIC subscription.',
    }),
    ApiBody({
      type: UpdatePetDto,
      description: 'Pet information to update',
    }),
    ApiResponse({
      status: 200,
      description: 'Pet successfully updated',
      type: PetResponseDTO,
    })
  );
}
