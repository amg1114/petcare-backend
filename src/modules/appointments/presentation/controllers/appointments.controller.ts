import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreateAppointmentDTO } from '@modules/appointments/application/dto/create-appointment.dto';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/create-appointment.usecase.dto';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiCreateAppointment } from '@modules/appointments/presentation/decorator/api-create-appointment.decorator';

@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiCreateAppointment()
  async createAppointment(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateAppointmentDTO
  ) {
    return this.createAppointmentUseCase.execute(user, dto);
  }
}
