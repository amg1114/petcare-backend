import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/users/domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.userRepository.delete(userId);
    if (!result) {
      throw new ConflictException('Failed to delete user');
    }

    return;
  }
}
