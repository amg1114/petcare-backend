import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/users/domain/value-objects/user-type.enum';

@ApiSchema({
  description: 'Data Transfer Object for creating a new user',
})
export class CreateUserDTO {
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
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description:
      'The phone number of the user. Use the Colombian format with country code.',
    example: '+57 123 456 7890',
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
