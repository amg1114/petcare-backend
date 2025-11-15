import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentORMEntity])],
})
export class AppointmentsModule {}
