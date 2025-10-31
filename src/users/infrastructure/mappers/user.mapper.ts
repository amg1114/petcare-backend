import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserORMEntity } from '../orm/user.orm-entity';

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
}
