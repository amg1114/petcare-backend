import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

export class ServiceDuration {
  static fromService(type: ServiceType) {
    switch (type) {
      case ServiceType.BATH:
      case ServiceType.HAIRCUT:
      case ServiceType.TRANSPORTATION:
        return 1;
      case ServiceType.MEDICALREVIEW:
      case ServiceType.FOLLOWUP:
        return 0.5;
      case ServiceType.DAYCARE:
        return 8;
    }
  }
}
