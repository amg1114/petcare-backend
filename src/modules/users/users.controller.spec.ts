import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './application/services/user.service';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';
import { UserType } from './domain/enums/user-type.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './application/dto/response-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: jest.Mocked<UserService>;

  // Mock response data
  const mockUserResponse: UserResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    type: UserType.CLIENTE,
    createdAt: new Date('2024-01-01'),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'StrongPassword123!',
    type: UserType.CLIENTE,
  };

  beforeEach(async () => {
    // Create a mock implementation of UserService
    const mockUserService = {
      createUser: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      findUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const expectedResponse = {
        ...mockUserResponse,
        email: mockCreateUserDto.email,
        name: mockCreateUserDto.name,
      };
      userService.createUser.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createUser(mockCreateUserDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(userService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      userService.createUser.mockRejectedValue(
        new ConflictException(
          `User with email ${mockCreateUserDto.email} already exists`,
        ),
      );

      // Act & Assert
      await expect(controller.createUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should validate required fields', async () => {
      // Arrange
      const invalidDto = {
        name: 'John',
        // Missing required fields: email, password, type
      } as CreateUserDto;

      // Note: In real scenario, this validation is handled by ValidationPipe
      // This test demonstrates what you'd expect
      userService.createUser.mockResolvedValue(mockUserResponse);

      // Act
      await controller.createUser(invalidDto);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(invalidDto);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      userService.findUserById.mockResolvedValue(mockUserResponse as any);

      // Act
      const result = await controller.findUserById(userId);

      // Assert
      expect(result).toEqual(mockUserResponse);
      expect(userService.findUserById).toHaveBeenCalledWith(userId);
      expect(userService.findUserById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      userService.findUserById.mockRejectedValue(
        new NotFoundException(`User with ID ${userId} not found`),
      );

      // Act & Assert
      await expect(controller.findUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findUserById(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
      expect(userService.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should handle UUID format', async () => {
      // Arrange
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      userService.findUserById.mockResolvedValue(mockUserResponse as any);

      // Act
      await controller.findUserById(validUUID);

      // Assert
      expect(userService.findUserById).toHaveBeenCalledWith(validUUID);
    });
  });

  describe('updateUser', () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      userService.updateUser.mockResolvedValue(updateResult);

      // Act
      const result = await controller.updateUser(userId, updateDto);

      // Assert
      expect(result).toEqual(updateResult);
      expect(userService.updateUser).toHaveBeenCalledWith(updateDto, userId);
      expect(userService.updateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      userService.updateUser.mockRejectedValue(
        new NotFoundException(`User with ID ${userId} not found`),
      );

      // Act & Assert
      await expect(controller.updateUser(userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.updateUser).toHaveBeenCalledWith(updateDto, userId);
    });

    it('should throw ConflictException when new email already exists', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      userService.updateUser.mockRejectedValue(
        new ConflictException(
          `User with email ${updateDto.email} already exists`,
        ),
      );

      // Act & Assert
      await expect(controller.updateUser(userId, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow partial updates', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      const partialUpdate: UpdateUserDto = { name: 'Only Name Update' };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      userService.updateUser.mockResolvedValue(updateResult);

      // Act
      await controller.updateUser(userId, partialUpdate);

      // Assert
      expect(userService.updateUser).toHaveBeenCalledWith(
        partialUpdate,
        userId,
      );
    });

    it('should handle password updates', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      const updateWithPassword: UpdateUserDto = {
        password: 'NewStrongPassword123!',
      };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      userService.updateUser.mockResolvedValue(updateResult);

      // Act
      await controller.updateUser(userId, updateWithPassword);

      // Assert
      expect(userService.updateUser).toHaveBeenCalledWith(
        updateWithPassword,
        userId,
      );
      // Password should be hashed by the service (tested in service tests)
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      const deleteResult = { affected: 1, raw: {} };
      userService.deleteUser.mockResolvedValue(deleteResult);

      // Act
      const result = await controller.deleteUser(userId);

      // Assert
      expect(result).toEqual(deleteResult);
      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
      expect(userService.deleteUser).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      userService.deleteUser.mockRejectedValue(
        new NotFoundException(`User with ID ${userId} not found`),
      );

      // Act & Assert
      await expect(controller.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should return affected count', async () => {
      // Arrange
      const userId = mockUserResponse.id;
      const deleteResult = { affected: 1, raw: {} };
      userService.deleteUser.mockResolvedValue(deleteResult);

      // Act
      const result = await controller.deleteUser(userId);

      // Assert
      expect(result.affected).toBe(1);
    });
  });

  /**
   * Integration-style test example
   * This demonstrates testing multiple operations in sequence
   */
  describe('User lifecycle', () => {
    it('should create, update, and delete a user', async () => {
      const userId = mockUserResponse.id;

      // Create
      userService.createUser.mockResolvedValue(mockUserResponse);
      const created = await controller.createUser(mockCreateUserDto);
      expect(created).toBeDefined();
      expect(userService.createUser).toHaveBeenCalled();

      // Update
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      userService.updateUser.mockResolvedValue(updateResult);
      await controller.updateUser(userId, updateDto);
      expect(userService.updateUser).toHaveBeenCalledWith(updateDto, userId);

      // Delete
      const deleteResult = { affected: 1, raw: {} };
      userService.deleteUser.mockResolvedValue(deleteResult);
      await controller.deleteUser(userId);
      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });
});
