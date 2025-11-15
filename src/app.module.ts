import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DataSourceConfig } from '@database/data.source';

import { AuthModule } from '@modules/auth/auth.module';
import { PetsModule } from '@modules/pets/pets.module';
import { UsersModule } from '@modules/users/users.module';
import { SharedModule } from '@modules/shared/shared.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(DataSourceConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    UsersModule,
    AuthModule,
    SharedModule,
    SubscriptionsModule,
    PetsModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
