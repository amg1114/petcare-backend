import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APPOINTMENT_REPOSITORY_TOKEN } from '@modules/appointments/domain/repositories/appointments.repository';

import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';
import { AppointmentRepositoryImpl } from '@modules/appointments/infrastructure/repositories/appointment.repository-impl';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentORMEntity])],
  providers: [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: AppointmentRepositoryImpl,
    },
  ],
  exports: [APPOINTMENT_REPOSITORY_TOKEN],
})
export class AppointmentsModule {}
