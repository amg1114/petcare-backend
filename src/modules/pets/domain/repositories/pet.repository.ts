import { PetEntity } from '@modules/pets/domain/entities/pet.entity';

/**
 * Pet repository token for dependency injection
 */
export const PET_REPOSITORY_TOKEN = 'PetRepository';

/**
 * Interface for pet repository operations
 */
export interface IPetRepository {
  save(pet: PetEntity): Promise<PetEntity>;

  findById(petId: string): Promise<PetEntity | null>;

  findByOwnerId(ownerId: string): Promise<PetEntity[] | null>;
}
