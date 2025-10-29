import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: UserEntity): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
