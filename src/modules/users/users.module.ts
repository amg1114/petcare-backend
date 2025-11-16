import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_REPOSITORY_TOKEN } from '@modules/users/domain/repositories/user.repository';

import { GetVeterinariansUseCase } from '@modules/users/application/use-cases/get-veterinarians.usecase';

import { VeterinariansController } from '@modules/users/presentation/controllers/veterinarians.controller';

import { SharedModule } from '@modules/shared/shared.module';

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
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserORMRepository,
    },
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    UpdatePasswordUseCase,
    GetVeterinariansUseCase,
  ],
  controllers: [UsersController, VeterinariansController],
  exports: ['UserRepository'],
})
export class UsersModule {}
