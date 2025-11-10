import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UserResponseDTO } from '../dto/user-response.dto';
import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toDTO(user);
  }
}
