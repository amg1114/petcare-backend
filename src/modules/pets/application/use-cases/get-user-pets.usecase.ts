import { Logger, Inject, NotFoundException, Injectable } from '@nestjs/common';

import {
  PET_REPOSITORY_TOKEN,
  IPetRepository,
} from '@modules/pets/domain/repositories/pet.repository';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@modules/users/domain/repositories/user.repository';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';

@Injectable()
export class GetUserPetsUseCase {
  private readonly logger = new Logger(GetUserPetsUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(ownerId: string) {
    const owner = await this.userRepository.findById(ownerId);

    if (!owner) {
      this.logger.error(
        `User with id ${ownerId} was not found when getting his pets`
      );
      throw new NotFoundException(`User with id ${ownerId} was not found`);
    }

    const pets = await this.petsRepository.findByOwnerId(owner.id);

    if (!pets) {
      throw new NotFoundException(
        `No pets were founded for the user: ${owner.id}`
      );
    }

    return pets.map(PetMapper.toDTO);
  }
}
