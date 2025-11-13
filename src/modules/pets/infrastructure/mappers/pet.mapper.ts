import { PetEntity } from '@modules/pets/domain/entities/pet.entity';

import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

export class PetMapper {
  static toDomain(ormEntity: PetORMEntity) {
    if (!ormEntity.owner) {
      throw new Error(
        "Pet's owner is required to map orm entity to a domain instance"
      );
    }

    const owner = UserMapper.toDomain(ormEntity.owner);

    return PetEntity.reconstitute({
      ...ormEntity,
      owner,
    });
  }

  static toDTO(domainEntity: PetEntity) {
    const dto = new PetResponseDTO();

    dto.id = domainEntity.id;
    dto.name = domainEntity.name;
    dto.species = domainEntity.species;
    dto.breed = domainEntity.breed;
    dto.birthDate = domainEntity.birthDate;
    dto.weight = domainEntity.weight;
    dto.photo = domainEntity.photo;
    dto.notes = domainEntity.notes;
    dto.createdAt = domainEntity.createdAt;

    return dto;
  }
}
