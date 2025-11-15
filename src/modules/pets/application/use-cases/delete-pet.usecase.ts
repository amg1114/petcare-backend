import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import {
  PET_REPOSITORY_TOKEN,
  IPetRepository,
} from '@modules/pets/domain/repositories/pet.repository';

@Injectable()
export class DeletePetUseCase {
  private readonly logger = new Logger(DeletePetUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petsRepository: IPetRepository
  ) {}

  async execute(user: UserEntity, petId: string) {
    this.logger.log(`Deleting a pet for user: ${user.id}`);

    const currentPet = await this.petsRepository.findById(petId);

    if (!currentPet) {
      this.logger.error(
        `Pet with id ${petId} was not found when deleting a pet`
      );
      throw new NotFoundException(`Pet with id ${petId} was not found`);
    }

    if (!currentPet.isOwner(user)) {
      this.logger.warn(
        `User with id ${user.id} was trying to delete the pet with ID ${petId}.`
      );
      throw new ForbiddenException(
        `You don't have permissions to delete this pet`
      );
    }

    await this.petsRepository.delete(currentPet.id);

    return;
  }
}
