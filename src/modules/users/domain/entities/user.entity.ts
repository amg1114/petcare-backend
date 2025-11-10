import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';

import { UserType } from '../value-objects/user-type.enum';

export interface UserEntityProps {
  id: string | undefined;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: UserType;
  stripeCustomerId?: string;
  subscription?: SubscriptionEntity[];
  createdAt?: Date;
  deletedAt?: Date;
}

export class UserEntity {
  id: string | undefined;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: UserType;
  stripeCustomerId?: string;
  subscription?: SubscriptionEntity[];
  createdAt?: Date;
  deletedAt?: Date;

  constructor(props: UserEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.phone = props.phone;
    this.type = props.type;
    this.stripeCustomerId = props.stripeCustomerId;
    this.subscription = props.subscription;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
  }

  /**
   * Create a new user entity.
   * @param props The properties of the user.
   * @returns The created user entity.
   */
  static create(
    props: Omit<UserEntityProps, 'id' | 'createdAt' | 'deletedAt'>,
  ): UserEntity {
    return new UserEntity({
      ...props,
      id: undefined,
    });
  }

  /**
   * Reconstitute a user entity from its properties.
   * @param params The properties of the user.
   * @returns The reconstituted user entity.
   */
  static reconstitute(props: UserEntityProps): UserEntity {
    if (!props.id) {
      throw new Error('ID is required to reconstitute an user');
    }
    return new UserEntity(props);
  }
}
