import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@modules/users/users.module';

import { StripeService } from './infrastructure/services/stripe.service';
import { WebhooksController } from './presentation/controllers/webhooks.controller';
import { SubscriptionORMEntity } from './infrastructure/orm/subscription.orm-entity';
import { HandleWebhooksUseCase } from './application/use-cases/handle-webhooks.usecase';
import { StripePricingService } from './infrastructure/services/stripe-pricing.service';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { CreateCheckoutSessionUseCase } from './application/use-cases/create-checkout-session.usecase';
import { SubscriptionRepositoryImpl } from './infrastructure/repositories/subscription-impl.repository';
import { GetCurrentSubscriptionUseCase } from './application/use-cases/get-current-subscription.usecase';
import { CancelCurrentSubscriptionUseCase } from './application/use-cases/cancel-current-subscription.usecase';
import { ReactivateCurrentSubscriptionUseCase } from './application/use-cases/reactivate-current-subscription.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionORMEntity]), UsersModule],
  providers: [
    {
      provide: 'STRIPE_SECRET_KEY',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    },
    {
      provide: 'SubscriptionRepository',
      useClass: SubscriptionRepositoryImpl,
    },
    ConfigService,
    StripeService,
    StripePricingService,
    CreateCheckoutSessionUseCase,
    HandleWebhooksUseCase,
    GetCurrentSubscriptionUseCase,
    CancelCurrentSubscriptionUseCase,
    ReactivateCurrentSubscriptionUseCase,
  ],
  exports: ['SubscriptionRepository'],
  controllers: [SubscriptionsController, WebhooksController],
})
export class SubscriptionsModule {}
