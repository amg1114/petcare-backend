import { UserType } from 'src/users/domain/value-objects/user-type.enum';

export class UserResponseDTO {
  id: string;
  email: string;
  name: string;
  phone: string;
  type: UserType;
  createdAt: Date;
}
