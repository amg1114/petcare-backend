import { Inject, Injectable, Logger } from '@nestjs/common';

import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import {
  IPetRepository,
  PET_REPOSITORY_TOKEN,
} from '@modules/pets/domain/repositories/pet.repository';

import { CreatePetDto } from '@modules/pets/application/dto/create-pet.dto';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';

@Injectable()
export class CreatePetUseCase {
  private readonly logger = new Logger(CreatePetUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository
  ) {}

  async execute(user: UserEntity, dto: CreatePetDto) {
    this.logger.log(`Creating a new pet for user: ${user.id}`);

    const newPet = PetEntity.create({
      ...dto,
      owner: user,
    });

    const savedPet = await this.petsRepository.save(newPet);
    return PetMapper.toDTO(savedPet);
  }
}
