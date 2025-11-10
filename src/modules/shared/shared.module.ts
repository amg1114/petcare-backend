import { Module } from '@nestjs/common';

import { PasswordService } from './infraestructure/services/password.service';

@Module({
  providers: [
    {
      provide: 'PasswordService',
      useClass: PasswordService,
    },
  ],
  exports: ['PasswordService'],
})
export class SharedModule {}
