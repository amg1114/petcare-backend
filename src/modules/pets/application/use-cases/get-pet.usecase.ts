import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';
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
export class GetPetUseCase {
  private readonly logger = new Logger(GetPetUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    user: UserEntity,
    subscription: SubscriptionEntity,
    petId: string
  ) {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      this.logger.error(
        `Pet with id ${petId} was not found when getting a pet`
      );
      throw new NotFoundException(`Pet with id ${petId} was not found`);
    }

    if (subscription.isBasic && !pet.isOwner(user)) {
      this.logger.warn(
        `User with id ${user.id} was trying to read the pet with ID ${petId}.`
      );
      throw new ForbiddenException(
        `You don't have permissions to read this pet`
      );
    }

    return PetMapper.toDTO(pet);
  }
}
