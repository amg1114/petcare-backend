import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreateCheckoutSessionUseCase } from '@modules/subscriptions/application/use-cases/create-checkout-session.usecase';
import { GetCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/get-current-subscription.usecase';
import { CancelCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/cancel-current-subscription.usecase';
import { ReactivateCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/reactivate-current-subscription.usecase';

import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt.guard';
import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import {
  ApiCancelOwnSubscription,
  ApiCheckoutSessionEndpoint,
  ApiGetOwnSubscription,
  ApiProtectionTestBasic,
  ApiProtectionTestProfessional,
  ApiReactivateOwnCurrentSubscription,
} from '@modules/subscriptions/presentation/decorators/subscriptions.decorator';

@Controller('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    private readonly getCurrentSubscriptionUseCase: GetCurrentSubscriptionUseCase,
    private readonly cancelCurrentSubscriptionUseCase: CancelCurrentSubscriptionUseCase,
    private readonly reactivateCurrentSubscriptionUseCase: ReactivateCurrentSubscriptionUseCase
  ) {}

  @Get('my/current')
  @ApiGetOwnSubscription()
  getOwnSubscription(
    @CurrentUser()
    user: UserEntity
  ) {
    return this.getCurrentSubscriptionUseCase.execute(user.id);
  }

  @Patch('my/current')
  @ApiReactivateOwnCurrentSubscription()
  reactivateOwnCurrentSubscription(
    @CurrentUser()
    user: UserEntity
  ) {
    return this.reactivateCurrentSubscriptionUseCase.execute(user.id);
  }

  @Delete('my/current')
  @ApiCancelOwnSubscription()
  cancelOwnCurrentSubscription(
    @CurrentUser()
    user: UserEntity
  ) {
    return this.cancelCurrentSubscriptionUseCase.execute(user.id);
  }

  @Get('checkout-session/:plan')
  @HttpCode(HttpStatus.CREATED)
  @ApiCheckoutSessionEndpoint()
  async createCheckoutSession(
    @Param('plan', new ParseEnumPipe(SubscriptionPlan)) plan: SubscriptionPlan,
    @CurrentUser()
    user: UserEntity
  ) {
    return this.createCheckoutSessionUseCase.execute(user.id, plan);
  }

  @Get('protection-test/basic')
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiProtectionTestBasic()
  protectionTestBasic() {
    return {
      message: 'Subscription protection test successful',
      plan: SubscriptionPlan.BASIC,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('protection-test/professional')
  @RequiresSubscription(SubscriptionPlan.PROFESSIONAL)
  @ApiProtectionTestProfessional()
  protectionTestProfessional() {
    return {
      message: 'Subscription protection test successful',
      plan: SubscriptionPlan.PROFESSIONAL,
      timestamp: new Date().toISOString(),
    };
  }
}
