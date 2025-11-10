import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsUserPassword } from '@modules/users/infrastructure/decoratos/user-password.decorator';

@ApiSchema({ description: 'Data transfer object for update user password' })
export class UpdatePasswordDTO {
  @IsUserPassword()
  @ApiProperty({
    description: 'Current user password',
    example: 'StrongPassword123!',
  })
  currentPassword: string;

  @IsUserPassword()
  @ApiProperty({
    description: 'New user password',
    example: 'StrongPassword123!',
  })
  newPassword: string;
}
