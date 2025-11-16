import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreateAppointmentDTO } from '@modules/appointments/application/dto/create-appointment.dto';
import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/create-appointment.usecase.dto';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateAppointmentDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Appointment was successfully created',
    type: AppointmentResponseDTO,
  })
  @RequiresSubscription(SubscriptionPlan.BASIC)
  async createAppointment(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateAppointmentDTO
  ) {
    return this.createAppointmentUseCase.execute(user, dto);
  }
}
