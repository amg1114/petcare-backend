import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreatePetDto } from '@modules/pets/application/dto/create-pet.dto';
import { UpdatePetDto } from '@modules/pets/application/dto/update-pet.dto';
import { GetPetUseCase } from '@modules/pets/application/use-cases/get-pet.usecase';
import { CreatePetUseCase } from '@modules/pets/application/use-cases/create-pet.usecase';
import { DeletePetUseCase } from '@modules/pets/application/use-cases/delete-pet.usecase';
import { UpdatePetUseCase } from '@modules/pets/application/use-cases/update-pet.usecase';
import { GetUserPetsUseCase } from '@modules/pets/application/use-cases/get-user-pets.usecase';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { CurrentSubscription } from '@modules/subscriptions/infrastructure/decorators/current-subscription.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiGetPet } from '@modules/pets/presentation/decorators/api-get-pet.decorator';
import { ApiCreatePet } from '@modules/pets/presentation/decorators/api-create-pet.decorator';
import { ApiDeletePet } from '@modules/pets/presentation/decorators/api-delete-pet.decorator';
import { ApiUpdatePet } from '@modules/pets/presentation/decorators/api-update-pet.decorator';
import { ApiGetUserPets } from '@modules/pets/presentation/decorators/api-get-user-pets.decorator';

@Controller('pets')
@ApiBearerAuth()
export class PetsController {
  constructor(
    private readonly getPetUseCase: GetPetUseCase,
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
    private readonly getUserPetsUseCase: GetUserPetsUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiGetUserPets()
  getUserPets(@CurrentUser() user: UserEntity) {
    return this.getUserPetsUseCase.execute(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequiresSubscription(SubscriptionPlan.BASIC, SubscriptionPlan.PROFESSIONAL)
  @ApiGetPet()
  getUserPet(
    @CurrentUser() user: UserEntity,
    @CurrentSubscription() subscription: SubscriptionEntity,
    @Param('id', new ParseUUIDPipe()) petId: string
  ) {
    return this.getPetUseCase.execute(user, subscription, petId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiCreatePet()
  createUserPet(@CurrentUser() user: UserEntity, @Body() dto: CreatePetDto) {
    return this.createPetUseCase.execute(user, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiUpdatePet()
  updateUserPet(
    @Param('id', new ParseUUIDPipe()) petId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdatePetDto
  ) {
    return this.updatePetUseCase.execute(user, petId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiDeletePet()
  deletePet(
    @Param('id', new ParseUUIDPipe()) petId: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.deletePetUseCase.execute(user, petId);
  }
}
