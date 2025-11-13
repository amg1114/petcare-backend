import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MaxDate } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetBirth() {
  const maxDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 50);

  return applyDecorators(
    IsNotEmpty({ message: 'Birth date is required' }),
    IsDate({ message: 'Birth date must be a valid date' }),
    Type(() => Date),
    MaxDate(maxDate, { message: 'Birth date cannot be in the future' })
  );
}
