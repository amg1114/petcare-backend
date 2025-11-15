import { IsEnum } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

export function IsValidAppointmentService() {
  return applyDecorators(
    IsEnum(ServiceType, {
      message: `Appointment service should be one of ${Object.values(ServiceType).join(', ')}`,
    })
  );
}
