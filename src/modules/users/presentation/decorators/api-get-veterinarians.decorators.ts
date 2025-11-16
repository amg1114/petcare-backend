import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';

export function ApiGetVeterinarians() {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns available veterinarians',
      description:
        'Returns veterinarians with an active subscription in the system. Requires a BASIC subscription plan',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Veterinarian list successfully returned',
      type: [UserResponseDTO],
    })
  );
}
