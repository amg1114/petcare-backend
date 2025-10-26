import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserType } from '../../domain/enums/user-type.enum';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiSchema({
  description: 'Data Transfer Object for updating an existing user',
})
export class UpdateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @MinLength(2, {
    message: 'Name is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Name is too long. Maximum length is $constraint1 characters.',
  })
  name?: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securepassword',
    required: false,
  })
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password?: string;

  @ApiProperty({
    description: 'Type of the user',
    example: UserType.CLIENTE,
    enum: UserType,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;
}
