import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

export function ApiGetPet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a pet by ID',
      description:
        'Retrieves detailed information about a specific pet. ' +
        'Users with BASIC subscription can only view their own pets. ' +
        'Users with PROFESSIONAL subscription can view any pet in the system.',
    }),
    ApiResponse({
      status: 200,
      description: 'Pet details successfully retrieved',
      type: PetResponseDTO,
    })
  );
}
