import { IsString, MaxLength, IsOptional } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetNotes() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'Notes must be a string' }),
    MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  );
}
