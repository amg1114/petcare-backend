import { Column, Entity } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { BaseOrmEntity } from '../../../shared/infrastructure/database/base-orm.entity';

@Entity('users')
export class UserEntity extends BaseOrmEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserType, nullable: false })
  type: UserType;
}
