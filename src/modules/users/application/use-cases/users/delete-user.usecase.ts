import {
  ConflictException,
  Inject,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
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
