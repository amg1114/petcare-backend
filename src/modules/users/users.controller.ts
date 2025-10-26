import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './application/services/user.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UserResponseDto } from './application/dto/response-user.dto';
import { ApiWrappedResponse } from '../shared/infrastructure/decorators/api-response-wrapper.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiWrappedResponse(UserResponseDto, 201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to retrieve' })
  @ApiWrappedResponse(UserResponseDto)
  async findUserById(id: string) {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'The ID of the user to update' })
  @ApiWrappedResponse(UserResponseDto)
  async updateUser(id: string, updateUserDto: any) {
    return this.userService.updateUser(updateUserDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to delete' })
  @ApiWrappedResponse(UserResponseDto)
  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }
}
