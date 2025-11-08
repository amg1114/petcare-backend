import { Module } from '@nestjs/common';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { SubscriptionRepositoryImpl } from './infrastructure/repositories/subscription-impl.repository';
import { StripeService } from './infrastructure/services/stripe.service';

@Module({
  controllers: [SubscriptionsController],
  imports: [UsersModule],
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
    StripeService,
  ],
})
export class SubscriptionsModule {}
