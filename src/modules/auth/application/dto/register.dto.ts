import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { UserType } from '@modules/users/domain/value-objects/user-type.enum';
import { IsUserPassword } from '@modules/users/infrastructure/decoratos/user-password.decorator';

@ApiSchema({
  description: 'Data Transfer Object for register a new user',
})
export class RegisterDTO {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPassword123!',
  })
  @IsUserPassword()
  password: string;

  @ApiProperty({
    description:
      'The phone number of the user. Use the Colombian format with country code.',
    example: '+571234567890',
  })
  @IsPhoneNumber('CO')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The type of the user',
    example: UserType.BASIC,
    enum: UserType,
  })
  @IsEnum(UserType)
  type: UserType;
}
