import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Data transfer object for auth request responses' })
export class AuthResponseDTO {
  access_token: string;
}
