import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetName() {
  const maxLength = 255;
  const minLength = 3;
  return applyDecorators(
    IsNotEmpty({ message: 'Pet name is required' }),
    IsString({ message: 'Pet name must be a valid string' }),
    MinLength(minLength, {
      message: `Pet name must be greatter than ${minLength} chars`,
    }),
    MaxLength(maxLength, {
      message: `Pet name must be less than ${maxLength} chars`,
    })
  );
}
