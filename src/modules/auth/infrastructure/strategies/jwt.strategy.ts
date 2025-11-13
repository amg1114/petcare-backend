import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, UnauthorizedException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';
import { IJwtPayload } from '@modules/auth/application/interfaces/jwt-payload.interface';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not Found');

    return UserMapper.toDTO(user);
  }
}
