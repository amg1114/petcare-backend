import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';

export function ApiDeleteAppointment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete an appointment',
      description: 'Delete an appointment. Requires a BASIC subscription plan',
    }),
    ApiParam({
      name: 'id',
      description: 'The appointment ID to be deleted',
      type: String,
      example: 'a1b2c3d4-5f6g-7h8i-9j0k-lmnopqrstuv',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The appointment was successfully deleted',
      type: AppointmentResponseDTO,
    })
  );
}
