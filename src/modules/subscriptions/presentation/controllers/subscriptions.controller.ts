import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.guard';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';

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

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';
import { CreateCheckoutSessionUseCase } from '@modules/subscriptions/application/use-cases/create-checkout-session.usecase';
import { GetCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/get-current-subscription.usecase';
import { CancelCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/cancel-current-subscription.usecase';
import { ReactivateCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/reactivate-current-subscription.usecase';
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
    private readonly reactivateCurrentSubscriptionUseCase: ReactivateCurrentSubscriptionUseCase,
  ) {}

  @Get('my/current')
  @ApiGetOwnSubscription()
  getOwnSubscription(
    @CurrentUser()
    user: UserResponseDTO,
  ) {
    return this.getCurrentSubscriptionUseCase.execute(user.id);
  }

  @Patch('my/current')
  @ApiReactivateOwnCurrentSubscription()
  reactivateOwnCurrentSubscription(
    @CurrentUser()
    user: UserResponseDTO,
  ) {
    return this.reactivateCurrentSubscriptionUseCase.execute(user.id);
  }

  @Delete('my/current')
  @ApiCancelOwnSubscription()
  cancelOwnCurrentSubscription(
    @CurrentUser()
    user: UserResponseDTO,
  ) {
    return this.cancelCurrentSubscriptionUseCase.execute(user.id);
  }

  @Get('checkout-session/:plan')
  @HttpCode(HttpStatus.CREATED)
  @ApiCheckoutSessionEndpoint()
  async createCheckoutSession(
    @Param('plan', new ParseEnumPipe(SubscriptionPlan)) plan: SubscriptionPlan,
    @CurrentUser()
    user: UserResponseDTO,
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
