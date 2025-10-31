import { UserType } from '../value-objects/user-type.enum';

export interface UserEntityProps {
  id: string | null;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: UserType;
  createdAt?: Date;
  deletedAt?: Date;
}

export class UserEntity {
  constructor(
    public readonly id: string | undefined,
    public name: string,
    public email: string,
    public password: string,
    public phone: string,
    public type: UserType,
    public createdAt?: Date,
    public deletedAt?: Date,
  ) {}

  /**
   * Create a new user entity.
   * @param props The properties of the user.
   * @returns The created user entity.
   */
  static create(
    props: Omit<UserEntityProps, 'id' | 'createdAt' | 'deletedAt'>,
  ): UserEntity {
    return new UserEntity(
      undefined,
      props.name,
      props.email,
      props.password,
      props.phone,
      props.type,
    );
  }

  static reconstitute(params: UserEntityProps): UserEntity {
    return new UserEntity(
      params.id,
      params.name,
      params.email,
      params.password,
      params.phone,
      params.type,
      params.createdAt,
      params.deletedAt,
    );
  }
}
