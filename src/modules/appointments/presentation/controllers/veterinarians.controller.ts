import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { GetAvailabilityQueryDto } from '@modules/appointments/application/dto/get-availability-query.dto';
import { GetVeterinarianAvailabilityUseCase } from '@modules/appointments/application/use-cases/get-veterinarian-availability.usecase';

import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiGetVeterinarianAvailability } from '@modules/appointments/presentation/decorator/api-get-veterinarian-availability.decorator';

@Controller('appointments/veterinarians')
@ApiBearerAuth()
export class VeterinariansController {
  constructor(
    private readonly getVeterinarianAvailabilityUseCase: GetVeterinarianAvailabilityUseCase
  ) {}

  @Get(':id')
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiGetVeterinarianAvailability()
  getVeterinarianAvailability(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() queries: GetAvailabilityQueryDto
  ) {
    return this.getVeterinarianAvailabilityUseCase.execute(id, queries.date);
  }
}
