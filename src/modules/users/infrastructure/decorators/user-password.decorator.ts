import { IsStrongPassword } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

export function IsUserPassword() {
  return applyDecorators(
    IsStrongPassword(
      {
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
      },
      {
        message:
          'The password must have a minimum of 8 characters, at least one uppercase letter, one lowercase letter and one number.',
      }
    )
  );
}
