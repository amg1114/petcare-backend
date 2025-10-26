import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(userData: Partial<UserEntity>): UserEntity {
    const user = this.userRepository.create(userData);
    return user;
  }

  /**
   * Find a user by ID
   * @param id The user ID to be found
   * @returns The user entity if found, null otherwise
   */
  findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Find a user by email
   * @param email The user email to be found
   * @returns The user entity if found, null otherwise
   */
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * Save a user
   * @param user The user entity to be saved
   * @returns The saved user entity
   */
  save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  /**
   * Delete a user by ID
   * @param id The user ID to be deleted
   * @returns The result of the delete operation
   */
  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  /**
   * Find all users
   * @returns An array of user entities
   */
  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  update(id: string, userData: Partial<UserEntity>): Promise<UpdateResult> {
    return this.userRepository.update(id, userData);
  }
}
