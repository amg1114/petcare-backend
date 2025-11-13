import { Request } from 'express';

import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/subscription.repository';

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';

import { IS_PUBLIC_KEY } from '@modules/auth/infrastructure/decorators/public-route.decorator';
import { REQUIRES_SUBSCRIPTION_KEY } from '@modules/subscriptions/infrastructure/decorators/requires-subscription.decorator';

@Injectable()
export class SubscriptionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('SubscriptionRepository')
    private readonly subscriptionsRepository: ISubscriptionRepository
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const user = request.user as UserResponseDTO;

    const requiredSubscriptions = this.reflector.getAllAndOverride<
      SubscriptionPlan[]
    >(REQUIRES_SUBSCRIPTION_KEY, [context.getHandler(), context.getClass()]);

    // If the requires subscription decorator is missing or empty allow use the route
    if (!requiredSubscriptions || !requiredSubscriptions.length) {
      return true;
    }

    const currentSub =
      await this.subscriptionsRepository.findCurrentSubscriptionByUserId(
        user.id
      );

    if (!currentSub || !currentSub.isActive) {
      throw new ForbiddenException('Active subscription required');
    }

    if (!requiredSubscriptions.includes(currentSub.plan)) {
      throw new ForbiddenException(
        `This feature requires one of the following subscription plans: ${requiredSubscriptions.join(', ')}`
      );
    }

    return true;
  }
}
