import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';

@ApiSchema({ description: 'Data transfer object for auth request responses' })
export class AuthResponseDTO {
  @ApiProperty({ description: 'JWT Token to be authenticated.' })
  access_token: string;

  @ApiProperty({ description: 'Data transfer object for authenticated user.' })
  user: UserResponseDTO;
}
