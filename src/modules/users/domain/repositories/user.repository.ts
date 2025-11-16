import { UserEntity } from '../entities/user.entity';

/**
 * User Repository token for dependency injection
 */
export const USER_REPOSITORY_TOKEN = 'UserRepository';

/**
 * User Repository interface
 */
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByStripeId(id: string): Promise<UserEntity | null>;
  findVeterinarianById(id: string): Promise<UserEntity | null>;
  getVeterinarians(): Promise<UserEntity[] | null>;
  save(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
