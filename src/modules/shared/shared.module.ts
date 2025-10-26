import { Module } from '@nestjs/common';
import { PasswordHasherService } from './infrastructure/services/password-hasher.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PasswordHasherService],
  exports: [PasswordHasherService],
})
export class SharedModule {}
