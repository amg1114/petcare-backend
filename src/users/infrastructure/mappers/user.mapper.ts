import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserORMEntity } from '../orm/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserORMEntity): UserEntity {
    return new UserEntity(
      ormEntity.id,
      ormEntity.name,
      ormEntity.email,
      ormEntity.password,
      ormEntity.phone,
      ormEntity.type,
      ormEntity.createdAt,
      ormEntity.deletedAt,
    );
  }

  static toORM(domainEntity: UserEntity): UserORMEntity {
    const ormEntity = new UserORMEntity();

    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.email = domainEntity.email;
    ormEntity.password = domainEntity.password;
    ormEntity.phone = domainEntity.phone;
    ormEntity.type = domainEntity.type;

    return ormEntity;
  }
}
