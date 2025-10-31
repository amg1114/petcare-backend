import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiSchema({
  description: 'Data Transfer Object for updating user information',
})
export class UpdateUserDTO {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description:
      'The phone number of the user. Use the Colombian format with country code.',
    example: '+57 123 456 7890',
  })
  @IsPhoneNumber('CO')
  @IsOptional()
  phone?: string;
}
