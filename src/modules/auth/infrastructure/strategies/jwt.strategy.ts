import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '@/modules/auth/application/interfaces/jwt-payload.interface';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, UnauthorizedException } from '@nestjs/common';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
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
