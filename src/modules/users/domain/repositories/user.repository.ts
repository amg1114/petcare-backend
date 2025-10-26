import { DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  createUser(userData: Partial<UserEntity>): UserEntity;

  findById(id: string): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  save(user: UserEntity): Promise<UserEntity>;

  delete(id: string): Promise<DeleteResult>;

  update(id: string, userData: Partial<UserEntity>): Promise<UpdateResult>;

  findAll(): Promise<UserEntity[]>;
}
