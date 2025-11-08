import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponseDTO } from 'src/auth/application/dto/auth-response.dto';
import { LoginDTO } from 'src/auth/application/dto/login.dto';
import { RegisterDTO } from 'src/auth/application/dto/register.dto';
import { LoginUseCase } from 'src/auth/application/use-cases/login.usecase';
import { RegisterUseCase } from 'src/auth/application/use-cases/register.usecase';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { PublicRoute } from 'src/auth/infrastructure/decorators/public-route.decorator';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt.guard';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';
import { GetUserUseCase } from 'src/users/application/use-cases/get-user.usecase';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an user' })
  @ApiOkResponse({ type: AuthResponseDTO })
  login(@Body() dto: LoginDTO) {
    return this.loginUseCase.execute(dto);
  }

  @PublicRoute()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register and login a new user' })
  @ApiOkResponse({ type: AuthResponseDTO })
  register(@Body() dto: RegisterDTO) {
    return this.registerUseCase.execute(dto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns the logged user data profile' })
  @ApiOkResponse({ type: UserResponseDTO })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  profile(@CurrentUser() currentUser: UserResponseDTO) {
    return this.getUserUseCase.execute(currentUser.id);
  }
}
