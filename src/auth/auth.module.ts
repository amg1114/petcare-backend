import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuhtController } from './presentation/controllers/auth.controller';
import { PasswordService } from './infrastructure/services/password.service';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { GetUserUseCase } from 'src/users/application/use-cases/get-user.usecase';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    UsersModule,
  ],
  controllers: [AuhtController],
  providers: [
    {
      provide: 'PasswordService',
      useClass: PasswordService,
    },
    LoginUseCase,
    RegisterUseCase,
    GetUserUseCase,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
