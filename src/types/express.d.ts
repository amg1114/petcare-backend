import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';

declare global {
  namespace Express {
    interface Request {
      user: UserResponseDTO;
    }
  }
}
