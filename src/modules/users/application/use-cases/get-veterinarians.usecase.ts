import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

@Injectable()
export class GetVeterinariansUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository
  ) {}

  async execute() {
    const veterinarians = await this.usersRepository.getVeterinarians();

    if (!veterinarians) {
      throw new NotFoundException('No veterinarians were found');
    }

    return veterinarians.map(UserMapper.toDTO);
  }
}
