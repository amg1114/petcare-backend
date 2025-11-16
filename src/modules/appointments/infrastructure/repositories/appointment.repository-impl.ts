import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';
import { IAppointmentRepository } from '@modules/appointments/domain/repositories/appointments.repository';

import { AppointmentMapper } from '@modules/appointments/infrastructure/mappers/appointment.mapper';
import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';

@Injectable()
export class AppointmentRepositoryImpl implements IAppointmentRepository {
  private logger = new Logger('AppointmentRepository');

  constructor(
    @InjectRepository(AppointmentORMEntity)
    private readonly repository: Repository<AppointmentORMEntity>
  ) {}

  async save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    try {
      if (!appointment.id) {
        const newAppointment = this.repository.create(appointment);
        const savedEntity = await this.repository.save(newAppointment);

        return AppointmentMapper.toDomain(savedEntity);
      }

      const savedEntity = await this.repository.save(appointment);
      return AppointmentMapper.toDomain(savedEntity);
    } catch (error: any) {
      this.logger.error(
        `Error saving appointment${appointment.id ? ' with ID ' + appointment.id : ''}: ${error.message}`
      );
      throw error;
    }
  }

  async findById(id: string): Promise<AppointmentEntity | null> {
    try {
      const appointmentOrm = await this.repository.findOneBy({ id });

      if (!appointmentOrm) return null;

      return AppointmentMapper.toDomain(appointmentOrm);
    } catch (error: any) {
      this.logger.error(
        `Error finding appointment by ID ${id}: ${error.message}`
      );
      throw error;
    }
  }

  async findByVetIdAndDate(
    vetId: string,
    scheduledAt: Date
  ): Promise<AppointmentEntity[] | null> {
    try {
      const appointments = await this.repository.find({
        where: { veterinarian: { id: vetId }, scheduledAt: scheduledAt },
        order: { scheduledAt: 'ASC' },
      });

      if (!appointments) return null;

      return appointments.map(AppointmentMapper.toDomain);
    } catch (error: any) {
      this.logger.error(
        `Error finding appointment by veterinarian ID ${vetId} and date ${scheduledAt}: ${error.message}`
      );
      throw error;
    }
  }

  async delete(appointmentId: string): Promise<void> {
    try {
      await this.repository.delete(appointmentId);
    } catch (error: any) {
      this.logger.error(
        `Error deleting appointment ${appointmentId}: ${error.message}`
      );
      throw error;
    }
  }
}
