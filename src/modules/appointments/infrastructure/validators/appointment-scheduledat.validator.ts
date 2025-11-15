import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidAppointmentScheduledAt() {
  const minDate = new Date();

  return applyDecorators(
    IsNotEmpty({ message: 'Appointment scheduled is required' }),
    IsDate({ message: 'Appointment scheduled must be a valid date' }),
    Type(() => String),
    MinDate(minDate, {
      message: 'Appointment scheduled date cannot be in the past',
    })
  );
}
