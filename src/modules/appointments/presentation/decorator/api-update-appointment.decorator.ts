import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { UpdateAppointmentDTO } from '@modules/appointments/application/dto/update-appointment.dto';
import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';

export function ApiUpdateAppointment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an appointment',
      description: 'Updates an appointment. Requires a BASIC subscription plan',
    }),
    ApiParam({
      name: 'id',
      description: 'The appointment ID to be updated',
      type: String,
      example: 'a1b2c3d4-5f6g-7h8i-9j0k-lmnopqrstuv',
    }),
    ApiBody({
      description: 'The appointment data to be updated',
      type: UpdateAppointmentDTO,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'The appointment was successfully updated',
      type: AppointmentResponseDTO,
    })
  );
}
