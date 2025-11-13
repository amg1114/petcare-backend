import { PetEntity } from '@modules/pets/domain/entities/pet.entity';

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
}
