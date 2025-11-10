import { SharedModule } from '@/modules/shared/shared.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@modules/users/users.module';
import { GetUserUseCase } from '@modules/users/application/use-cases/get-user.usecase';

import { JwtAuthGuard } from './infrastructure/guards/jwt.guard';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    SharedModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetUserUseCase,
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
