import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SubscriptionPlan } from 'src/subscriptions/domain/value-objects/subscription-plan.vo';
import { SubscriptionStatus } from 'src/subscriptions/domain/value-objects/subscription-status.vo';

@ApiSchema({ description: 'Subscription response data' })
export class SubscriptionResponseDTO {
  @ApiProperty({ description: 'Unique identifier of the subscription' })
  id: string;

  @ApiProperty({
    description: 'Subscription plan type',
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Current status of the subscription',
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @ApiProperty({ description: 'Subscription start date' })
  startAt: Date;

  @ApiProperty({ description: 'Subscription end date' })
  endAt: Date;

  @ApiProperty({
    description:
      'Whether the subscription will be cancelled at the end of the period',
  })
  cancelAtEnd: boolean;

  @ApiProperty({ description: 'Date when the subscription was created' })
  createdAt?: Date;
}
