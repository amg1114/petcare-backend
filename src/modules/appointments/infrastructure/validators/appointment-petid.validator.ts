import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidAppointmentPetId() {
  return applyDecorators(
    IsNotEmpty({ message: 'Pet ID is required' }),
    IsUUID('4', { message: 'Pet ID must be a valid id' }),
    Type(() => String)
  );
}
