import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { UserService } from './application/services/user.service';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { UsersController } from './users.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharedModule],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
