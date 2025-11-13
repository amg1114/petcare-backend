import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserResponseDTO } from '../dto/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}
  async execute(
    userId: string,
    updateUserDto: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedUser = { ...existingUser, ...updateUserDto };
    await this.userRepository.update(userId, updatedUser);

    return UserMapper.toDTO(updatedUser);
  }
}
