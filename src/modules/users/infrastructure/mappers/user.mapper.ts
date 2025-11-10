import { UserEntity } from '@modules/users/domain/entities/user.entity';

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';

import { UserORMEntity } from '../orm/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserORMEntity): UserEntity {
    return UserEntity.reconstitute(ormEntity);
  }

  static toDTO(domainEntity: UserEntity): UserResponseDTO {
    const dto = new UserResponseDTO();

    dto.id = domainEntity.id ?? '';
    dto.email = domainEntity.email;
    dto.name = domainEntity.name;
    dto.phone = domainEntity.phone;
    dto.type = domainEntity.type;
    dto.createdAt = domainEntity.createdAt ?? null;

    return dto;
  }
}
