import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PET_REPOSITORY_TOKEN } from '@modules/pets/domain/repositories/pet.repository';

import { CreatePetUseCase } from '@modules/pets/application/use-cases/create-pet.usecase';
import { GetUserPetsUseCase } from '@modules/pets/application/use-cases/get-user-pets.usecase';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { PetRepositoryImpl } from '@modules/pets/infrastructure/repositories/pet.repository-impl';

import { PetsController } from '@modules/pets/presentation/controllers/pets.controller';

import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetORMEntity]), UsersModule],
  providers: [
    {
      provide: PET_REPOSITORY_TOKEN,
      useClass: PetRepositoryImpl,
    },
    CreatePetUseCase,
    GetUserPetsUseCase,
  ],
  exports: [PET_REPOSITORY_TOKEN],
  controllers: [PetsController],
})
export class PetsModule {}
