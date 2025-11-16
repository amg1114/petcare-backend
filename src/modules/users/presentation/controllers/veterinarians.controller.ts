import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { GetVeterinariansUseCase } from '@modules/users/application/use-cases/veterinarians/get-veterinarians.usecase';

import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiGetVeterinarians } from '@modules/users/presentation/decorators/api-get-veterinarians.decorators';

@Controller('users/veterinarians')
@ApiBearerAuth()
export class VeterinariansController {
  constructor(
    private readonly getVeterinariansUseCase: GetVeterinariansUseCase
  ) {}

  @Get()
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiGetVeterinarians()
  getVeterinarians() {
    return this.getVeterinariansUseCase.execute();
  }
}
