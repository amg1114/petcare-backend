import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';

export function ApiGetUserAppointments() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user upcoming appointments',
      description:
        'Get upcoming appointments for the authenticated user. BASIC users will receive their pet appointments and PROFESSIONAL users will receive their appointments as the assigned veterinarian',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'The user upcoming appointment list was successfully returned.',
      type: [AppointmentResponseDTO],
    })
  );
}
