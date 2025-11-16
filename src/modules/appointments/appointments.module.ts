import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APPOINTMENT_REPOSITORY_TOKEN } from '@modules/appointments/domain/repositories/appointments.repository';

import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/create-appointment.usecase.dto';

import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';
import { AppointmentRepositoryImpl } from '@modules/appointments/infrastructure/repositories/appointment.repository-impl';

import { AppointmentsController } from '@modules/appointments/presentation/controllers/appointments.controller';

import { PetsModule } from '@modules/pets/pets.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentORMEntity]),
    UsersModule,
    PetsModule,
  ],
  providers: [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: AppointmentRepositoryImpl,
    },
    CreateAppointmentUseCase,
  ],
  exports: [APPOINTMENT_REPOSITORY_TOKEN],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
