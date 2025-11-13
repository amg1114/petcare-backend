import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

export function ApiGetUserPets() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user pets',
      description:
        'Gets pets for the authenticated user. Requires an active BASIC subscription.',
    }),
    ApiResponse({
      status: 200,
      description: 'Pet successfully returned',
      type: [PetResponseDTO],
    })
  );
}
