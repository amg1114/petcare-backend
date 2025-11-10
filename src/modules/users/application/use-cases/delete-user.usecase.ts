import {
  ConflictException,
  Inject,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
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
  }
}
