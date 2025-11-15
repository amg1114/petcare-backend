import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import {
  PET_REPOSITORY_TOKEN,
  IPetRepository,
} from '@modules/pets/domain/repositories/pet.repository';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@modules/users/domain/repositories/user.repository';

import { UpdatePetDto } from '@modules/pets/application/dto/update-pet.dto';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';

@Injectable()
export class UpdatePetUseCase {
  private readonly logger = new Logger(UpdatePetUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(ownerId: string, petId: string, dto: UpdatePetDto) {
    this.logger.log(`Updating a pet for user: ${ownerId}`);

    const owner = await this.userRepository.findById(ownerId);

    if (!owner) {
      this.logger.error(
        `User with id ${ownerId} was not found when updating a pet`
      );
      throw new NotFoundException(`User with id ${ownerId} was not found`);
    }

    let currentPet = await this.petsRepository.findById(petId);

    if (!currentPet) {
      this.logger.error(
        `Pet with id ${petId} was not found when updating a pet`
      );
      throw new NotFoundException(`Pet with id ${petId} was not found`);
    }

    if (!currentPet.isOwner(owner)) {
      this.logger.error(
        `User with id ${ownerId} was trying to update the pet with ID ${petId}.`
      );
      throw new ForbiddenException(
        `You don't have permissions to update this pet`
      );
    }

    currentPet = PetEntity.reconstitute({
      ...currentPet,
      ...dto,
    });

    currentPet = await this.petsRepository.save(currentPet);

    return PetMapper.toDTO(currentPet);
  }
}
