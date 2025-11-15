import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
