import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Min, Max } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetWeight() {
  return applyDecorators(
    Type(() => Number),
    IsNumber({}, { message: 'Weight must be a number' }),
    IsPositive({ message: 'Weight must be positive' }),
    Min(0.1, { message: 'Weight must be at least 0.1 kg' }),
    Max(1000, { message: 'Weight must not exceed 1000 kg' })
  );
}
