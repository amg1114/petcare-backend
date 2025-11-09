import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { UserORMEntity } from '../orm/user.orm-entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserORMRepository implements UserRepository {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>,
  ) {}

  /**
   * Find a user by their ID.
   * @param id The ID of the user.
   * @returns The user entity or null if not found.
   */
  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  /**
   * Find a user by their email.
   * @param email The email of the user.
   * @returns The user entity or null if not found.
   */
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  /**
   * Find a user by their stripe id.
   * @param id The stripe id of the user.
   * @returns The user entity or null if not found.
   */

  async findByStripeId(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ stripeCustomerId: id });

    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  /**
   * Save a user.
   * @param user The user entity to save.
   * @returns The saved user entity.
   */
  async save(user: UserEntity) {
    if (!user.id) {
      const newUserEntity = this.userRepository.create(user);
      const savedEntity = await this.userRepository.save(newUserEntity);
      return UserMapper.toDomain(savedEntity);
    }

    const savedEntity = await this.userRepository.save(user);
    return UserMapper.toDomain(savedEntity);
  }

  /**
   * Update a user.
   * @param id The ID of the user to update.
   * @param user The user entity with updated data.
   * @returns The updated user entity or null if not found.
   */
  async update(id: string, user: UserEntity) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      return null;
    }

    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {
      return null;
    }
    return UserMapper.toDomain(updatedUser);
  }

  /**
   * Delete a user.
   * @param id The ID of the user to delete.
   * @returns True if the user was deleted, false otherwise.
   */
  async delete(id: string) {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
