import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserResponseDTO } from '../dto/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}
  async execute(
    userId: string,
    updateUserDto: UpdateUserDTO,
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
