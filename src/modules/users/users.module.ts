import { SharedModule } from '@/modules/shared/shared.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserORMEntity } from './infrastructure/orm/user.orm-entity';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { UsersController } from './presentation/controllers/users.controller';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { UserORMRepository } from './infrastructure/repositories/user.orm-repository';
import { UpdatePasswordUseCase } from './application/use-cases/update-password.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserORMEntity]), SharedModule],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserORMRepository,
    },
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    UpdatePasswordUseCase,
  ],
  controllers: [UsersController],
  exports: ['UserRepository'],
})
export class UsersModule {}
