import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

@ApiSchema({ description: 'Data transfer object for login users' })
export class LoginDTO {
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
}
