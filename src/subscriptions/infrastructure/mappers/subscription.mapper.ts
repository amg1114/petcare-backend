import { SubscriptionEntity } from 'src/subscriptions/domain/entities/subscription.entity';
import { SubscriptionORMEntity } from '../orm/subscription.orm-entity';
import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';
import { SubscriptionResponseDTO } from 'src/subscriptions/application/dto/subscription-response.dto';

export class SubscriptionMapper {
  static toDomain(ormEntity: SubscriptionORMEntity): SubscriptionEntity {
    if (!ormEntity.user) {
      throw new Error(
        "Subscription's user is required to map orm entity to a domain instance",
      );
    }

    const user = UserMapper.toDomain(ormEntity.user);

    return SubscriptionEntity.reconstitute({
      ...ormEntity,
      user,
    });
  }

  static toDTO(entity: SubscriptionEntity) {
    const dto = new SubscriptionResponseDTO();

    dto.id = entity.id;
    dto.plan = entity.plan;
    dto.status = entity.status;
    dto.cancelAtEnd = entity.cancelAtEnd;
    dto.startAt = entity.startAt;
    dto.endAt = entity.endAt;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
