import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APPOINTMENT_REPOSITORY_TOKEN } from '@modules/appointments/domain/repositories/appointments.repository';

import { DeleteAppointmentUseCase } from '@modules/appointments/application/use-cases/delete-appointment.usecase';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/create-appointment.usecase.dto';
import { UpdateAppointmentUseCase } from '@modules/appointments/application/use-cases/update-appointment.usecase.dto';
import { GetUserAppointmentsUseCase } from '@modules/appointments/application/use-cases/get-user-appointments.usecase.dto';
import { GetVeterinarianAvailabilityUseCase } from '@modules/appointments/application/use-cases/get-veterinarian-availability.usecase';

import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';
import { AppointmentRepositoryImpl } from '@modules/appointments/infrastructure/repositories/appointment.repository-impl';

import { AppointmentsController } from '@modules/appointments/presentation/controllers/appointments.controller';
import { VeterinariansController } from '@modules/appointments/presentation/controllers/veterinarians.controller';

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
    GetUserAppointmentsUseCase,
    UpdateAppointmentUseCase,
    DeleteAppointmentUseCase,
    GetVeterinarianAvailabilityUseCase,
  ],
  exports: [APPOINTMENT_REPOSITORY_TOKEN],
  controllers: [AppointmentsController, VeterinariansController],
})
export class AppointmentsModule {}
