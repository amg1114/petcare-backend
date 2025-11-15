import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

export function ApiDeletePet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a pet',
      description:
        'Deletes a pet for the authenticated user. Requires an active BASIC subscription.',
    }),
    ApiResponse({
      status: 204,
      description: 'Pet successfully deleted',
      type: PetResponseDTO,
    })
  );
}
