import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserORMEntity } from '../orm/user.orm-entity';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';

export class UserMapper {
  static toDomain(ormEntity: UserORMEntity): UserEntity {
    return UserEntity.reconstitute(ormEntity);
  }

  static toORM(domainEntity: UserEntity): UserORMEntity {
    const ormEntity = new UserORMEntity();

    if (domainEntity.id) ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.email = domainEntity.email;
    ormEntity.password = domainEntity.password;
    ormEntity.phone = domainEntity.phone;
    ormEntity.type = domainEntity.type;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.deletedAt = domainEntity.deletedAt;

    return ormEntity;
  }

  static toDTO(domainEntity: UserEntity): UserResponseDTO {
    const dto = new UserResponseDTO();

    dto.id = domainEntity.id!;
    dto.email = domainEntity.email;
    dto.name = domainEntity.name;
    dto.phone = domainEntity.phone;
    dto.type = domainEntity.type;
    dto.createdAt = domainEntity.createdAt!;

    return dto;
  }
}
