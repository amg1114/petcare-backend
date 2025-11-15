import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidAppointmentVetId() {
  return applyDecorators(
    IsNotEmpty({ message: 'Veterinarian ID is required' }),
    IsUUID('4', { message: 'Veterinarian ID must be a valid id' }),
    Type(() => String)
  );
}
