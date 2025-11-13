import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetORMEntity])],
})
export class PetsModule {}
