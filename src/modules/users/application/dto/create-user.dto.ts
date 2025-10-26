import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserType } from '../../domain/enums/user-type.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiSchema({
  description: 'Data Transfer Object for creating a new user',
})
export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Name is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Name is too long. Maximum length is $constraint1 characters.',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;

  @ApiProperty({ description: 'Type of the user', example: UserType.CLIENTE })
  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
