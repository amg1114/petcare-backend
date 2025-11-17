import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreateAppointmentDTO } from '@modules/appointments/application/dto/create-appointment.dto';
import { UpdateAppointmentDTO } from '@modules/appointments/application/dto/update-appointment.dto';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/create-appointment.usecase.dto';
import { UpdateAppointmentUseCase } from '@modules/appointments/application/use-cases/update-appointment.usecase.dto';
import { GetUserAppointmentsUseCase } from '@modules/appointments/application/use-cases/get-user-appointments.usecase.dto';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { CurrentSubscription } from '@modules/subscriptions/infrastructure/decorators/current-subscription.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiCreateAppointment } from '@modules/appointments/presentation/decorator/api-create-appointment.decorator';
import { ApiUpdateAppointment } from '@modules/appointments/presentation/decorator/api-update-appointment.decorator';
import { ApiGetUserAppointments } from '@modules/appointments/presentation/decorator/api-get-user-appointments.decorator';

@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly getUserAppointmentUseCase: GetUserAppointmentsUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase
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

  @Get()
  @RequiresSubscription(SubscriptionPlan.BASIC, SubscriptionPlan.PROFESSIONAL)
  @ApiGetUserAppointments()
  getUserAppointments(
    @CurrentUser() user: UserEntity,
    @CurrentSubscription() subscription: SubscriptionEntity
  ) {
    return this.getUserAppointmentUseCase.execute(user.id, subscription);
  }

  @Patch(':id')
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiUpdateAppointment()
  updateAppointment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateAppointmentDTO
  ) {
    return this.updateAppointmentUseCase.execute(user, id, dto);
  }
}
