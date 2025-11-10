import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsUserPassword } from '@modules/users/infrastructure/decoratos/user-password.decorator';

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
  @IsUserPassword()
  password: string;
}
