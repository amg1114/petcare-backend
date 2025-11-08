import { Module } from '@nestjs/common';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';

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
  ],
})
export class SubscriptionsModule {}
