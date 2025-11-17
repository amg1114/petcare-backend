import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { VeterinarianAvailableSlotsDTO } from '@modules/appointments/application/dto/veterinarian-available-slots.dto';

export function ApiGetVeterinarianAvailability() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get veterinarian availability',
      description:
        'Gets available slot dates for a specific veterinarian. Requires BASIC subscription type.',
    }),
    ApiParam({
      name: 'id',
      description: 'The veterinarian ID',
      type: String,
      example: 'a1b2c3d4-5f6g-7h8i-9j0k-lmnopqrstuv',
    }),
    ApiQuery({
      name: 'date',
      description: 'Date to check availability (ISO 8601 format)',
      example: '2025-11-16',
      type: String,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'The veterinarian available slot dates.',
      type: VeterinarianAvailableSlotsDTO,
    })
  );
}
