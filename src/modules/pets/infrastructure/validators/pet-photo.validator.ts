import { IsString, IsUrl } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsValidPetPhoto() {
  return applyDecorators(
    IsString({ message: 'Photo must be a string' }),
    IsUrl({}, { message: 'Photo must be a valid URL' })
  );
}
