import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import {
  IPetRepository,
  PET_REPOSITORY_TOKEN,
} from '@modules/pets/domain/repositories/pet.repository';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

import { CreatePetDto } from '@modules/pets/application/dto/create-pet.dto';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';

@Injectable()
export class CreatePetUseCase {
  private readonly logger = new Logger(CreatePetUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(ownerId: string, dto: CreatePetDto) {
    this.logger.log(`Creating a new pet for user: ${ownerId}`);

    const owner = await this.userRepository.findById(ownerId);

    if (!owner) {
      this.logger.error(
        `User with id ${ownerId} was not found when creating a pet`
      );
      throw new NotFoundException(`User with id ${ownerId} was not found`);
    }

    const newPet = PetEntity.create({
      ...dto,
      owner,
    });

    const savedPet = await this.petsRepository.save(newPet);
    return PetMapper.toDTO(savedPet);
  }
}
