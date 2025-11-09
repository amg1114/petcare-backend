import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt.guard';
import { CreateCheckoutSessionUseCase } from 'src/subscriptions/application/use-cases/create-checkout-session.usecase';
import { SubscriptionPlan } from 'src/subscriptions/domain/value-objects/subscription-plan.vo';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';
import { ApiCheckoutSessionEndpoint } from '../decorators/subscriptions.decoratos';

@Controller('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
  ) {}

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
