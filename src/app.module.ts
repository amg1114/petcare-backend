import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forRoot(DataSourceConfig), UsersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
