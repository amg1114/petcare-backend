import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.guard';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
import { SubscriptionResponseDTO } from '@modules/subscriptions/application/dto/subscription-response.dto';
import { CreateCheckoutSessionUseCase } from '@modules/subscriptions/application/use-cases/create-checkout-session.usecase';
import { GetCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/get-current-subscription.usecase';
import { CancelCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/cancel-current-subscription.usecase';
import { ReactivateCurrentSubscriptionUseCase } from '@modules/subscriptions/application/use-cases/reactivate-current-subscription.usecase';

import { ApiCheckoutSessionEndpoint } from '../decorators/subscriptions.decorators';

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
  @ApiOperation({ description: "Get the current user's subscription" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the user's subscription details",
    type: SubscriptionResponseDTO,
  })
  getOwnSubscription(
    @CurrentUser()
    user: UserResponseDTO,
  ) {
    return this.getCurrentSubscriptionUseCase.execute(user.id);
  }

  @Patch('my/current')
  @ApiOperation({ description: "Reactivate the current user's subscription" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the user's subscription details",
    type: SubscriptionResponseDTO,
  })
  reactivateOwnCurrentSubscription(
    @CurrentUser()
    user: UserResponseDTO,
  ) {
    return this.reactivateCurrentSubscriptionUseCase.execute(user.id);
  }

  @Delete('my/current')
  @ApiOperation({ description: "Cancel the current user's subscription" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the user's subscription details",
    type: SubscriptionResponseDTO,
  })
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
}
