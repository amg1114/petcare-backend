import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

import { CreatePetDto } from '@modules/pets/application/dto/create-pet.dto';
import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';
import { CreatePetUseCase } from '@modules/pets/application/use-cases/create-pet.usecase';
import { GetUserPetsUseCase } from '@modules/pets/application/use-cases/get-user-pets.usecase';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import { RequiresSubscription } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

import { ApiCreatePet } from '@modules/pets/presentation/decorators/api-create-pet.decorator';
import { ApiGetUserPets } from '@modules/pets/presentation/decorators/api-get-user-pets.decorator';

@Controller('pets')
@ApiBearerAuth()
export class PetsController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly getUserPetsUseCase: GetUserPetsUseCase
  ) {}

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiGetUserPets()
  getUserPets(@CurrentUser() user: UserResponseDTO) {
    return this.getUserPetsUseCase.execute(user.id);
  }

  @Post('my')
  @HttpCode(HttpStatus.CREATED)
  @RequiresSubscription(SubscriptionPlan.BASIC)
  @ApiCreatePet()
  createUserPet(
    @CurrentUser() user: UserResponseDTO,
    @Body() dto: CreatePetDto
  ) {
    return this.createPetUseCase.execute(user.id, dto);
  }
}
