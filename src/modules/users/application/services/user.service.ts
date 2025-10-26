import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/response-user.dto';
import { PasswordHasherService } from 'src/modules/shared/infrastructure/services/password-hasher.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  /**
   * Find a user by ID
   * @param id The user ID to be found
   * @throws NotFoundException if the user is not found
   * @returns The user entity if found
   */
  async findUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find a user by email
   * @param email The user email to be found
   * @throws NotFoundException if the user is not found
   * @returns The user entity if found
   */
  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Create a new user
   * @param user The user data to be created
   * @returns The created user entity
   */
  async createUser(user: CreateUserDto) {
    const newUser = this.userRepository.createUser(user);
    const existingUser = await this.userRepository.findByEmail(newUser.email);

    if (existingUser) {
      throw new ConflictException(
        `User with email ${newUser.email} already exists`,
      );
    }

    newUser.password = await this.passwordHasherService.hash(newUser.password);

    return this.userRepository
      .save(newUser)
      .then((savedUser) => plainToInstance(UserResponseDto, savedUser));
  }

  /**
   * Update an existing user
   * @param user The user data to be updated
   * @param id The user ID to be updated
   * @throws NotFoundException if the user is not found
   * @returns The updated user entity
   */
  async updateUser(user: UpdateUserDto, id: string) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.email && user.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(user.email);
      if (userWithEmail) {
        throw new ConflictException(
          `User with email ${user.email} already exists`,
        );
      }
    }

    if (user.password) {
      user.password = await this.passwordHasherService.hash(user.password);
    }

    return this.userRepository.update(id, user);
  }

  /**
   * Delete a user by ID
   * @param id The user ID to be deleted
   * @throws NotFoundException if the user is not found
   * @returns The result of the delete operation
   */
  async deleteUser(id: string) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.delete(id);
  }
}
