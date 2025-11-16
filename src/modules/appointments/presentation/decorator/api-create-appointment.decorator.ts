import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';

export function ApiCreateAppointment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new appointment',
      description:
        "Create a new appointment for some of the authenticated user's pets. Requires a BASIC subscription plan",
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Appointment successfully created',
      type: AppointmentResponseDTO,
    })
  );
}
