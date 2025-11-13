import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetBreed() {
  const maxLength = 100;
  const minLength = 1;

  return applyDecorators(
    IsNotEmpty({ message: 'Pet breed is required' }),
    IsString({ message: 'Pet breed must be a valid string' }),
    MinLength(minLength, {
      message: `Pet breed must be greatter than ${minLength} chars`,
    }),
    MaxLength(maxLength, {
      message: `Pet breed must be less than ${maxLength} chars`,
    })
  );
}
