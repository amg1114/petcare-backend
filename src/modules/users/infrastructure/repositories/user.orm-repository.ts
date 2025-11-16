import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';
import { SubscriptionStatus } from '@modules/subscriptions/domain/value-objects/subscription-status.vo';

import { UserMapper } from '../mappers/user.mapper';
import { UserORMEntity } from '../orm/user.orm-entity';

@Injectable()
export class UserORMRepository implements IUserRepository {
  private logger = new Logger(UserORMRepository.name);

  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>
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

  async getVeterinarians(): Promise<UserEntity[] | null> {
    try {
      const veterinarians = await this.userRepository.find({
        where: {
          subscriptions: {
            status: SubscriptionStatus.ACTIVE,
            plan: SubscriptionPlan.PROFESSIONAL,
          },
        },
      });

      if (!veterinarians.length) return null;

      return veterinarians.map(UserMapper.toDomain);
    } catch (error: any) {
      this.logger.error(`Error when getting veterinarians:` + error.message);

      throw error;
    }
  }

  async findVeterinarianById(id: string): Promise<UserEntity | null> {
    try {
      const veterinarian = await this.userRepository.findOne({
        where: {
          id,
          subscriptions: {
            status: SubscriptionStatus.ACTIVE,
            plan: SubscriptionPlan.PROFESSIONAL,
          },
        },
      });

      if (!veterinarian) return null;

      return UserMapper.toDomain(veterinarian);
    } catch (error: any) {
      this.logger.error(
        `Error when finding a veterinarian with ID ${id}:` + error.message
      );

      throw error;
    }
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
