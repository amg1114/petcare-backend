import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasherService } from '../../../shared/infrastructure/services/password-hasher.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserType } from '../../domain/enums/user-type.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasherService: jest.Mocked<PasswordHasherService>;

  // Mock data that we'll use across tests
  const mockUser: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword123',
    type: UserType.CLIENTE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'PlainPassword123!',
    type: UserType.CLIENTE,
  };

  beforeEach(async () => {
    // Create mock implementations for all repository methods
    const mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    // Create mock implementation for password hasher
    const mockPasswordHasherService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: PasswordHasherService,
          useValue: mockPasswordHasherService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('UserRepository');
    passwordHasherService = module.get(PasswordHasherService);
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      // Arrange: Set up the mock to return our mock user
      userRepository.findById.mockResolvedValue(mockUser);

      // Act: Call the method we're testing
      const result = await service.findUserById(mockUser.id);

      // Assert: Check the results
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange: Mock returns null (user not found)
      const userId = 'non-existent-id';
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert: Expect the method to throw
      await expect(service.findUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findUserById(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user when found by email', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await service.findUserByEmail(mockUser.email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user email does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findUserByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findUserByEmail(email)).rejects.toThrow(
        `User with email ${email} not found`,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const newUser = {
        ...mockCreateUserDto,
        id: 'new-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity;

      userRepository.createUser.mockReturnValue(newUser);
      userRepository.findByEmail.mockResolvedValue(null); // No existing user
      passwordHasherService.hash.mockResolvedValue('hashedPassword123');
      userRepository.save.mockResolvedValue({
        ...newUser,
        password: 'hashedPassword123',
      });

      // Act
      const result = await service.createUser(mockCreateUserDto);

      // Assert
      expect(userRepository.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(passwordHasherService.hash).toHaveBeenCalledWith(
        mockCreateUserDto.password,
      );
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.email).toBe(mockCreateUserDto.email);
      // Password should not be in the response (handled by plainToInstance)
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const newUser = {
        ...mockCreateUserDto,
        id: 'new-user-id',
      } as UserEntity;

      userRepository.createUser.mockReturnValue(newUser);
      userRepository.findByEmail.mockResolvedValue(mockUser); // User already exists

      // Act & Assert
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        `User with email ${mockCreateUserDto.email} already exists`,
      );
      expect(passwordHasherService.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const userId = mockUser.id;
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(null); // New email is available
      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      // Act
      const result = await service.updateUser(updateDto, userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateDto);
      expect(result.affected).toBe(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateUser(updateDto, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new email already exists', async () => {
      // Arrange
      const userId = mockUser.id;
      const anotherUser = { ...mockUser, id: 'another-user-id' };
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(anotherUser); // Email taken by another user

      // Act & Assert
      await expect(service.updateUser(updateDto, userId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.updateUser(updateDto, userId)).rejects.toThrow(
        `User with email ${updateDto.email} already exists`,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should hash password when password is being updated', async () => {
      // Arrange
      const updateWithPassword: UpdateUserDto = {
        ...updateDto,
        password: 'NewPassword123!',
      };
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasherService.hash.mockResolvedValue('newHashedPassword');
      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      // Act
      await service.updateUser(updateWithPassword, mockUser.id);

      // Assert
      expect(passwordHasherService.hash).toHaveBeenCalledWith(
        'NewPassword123!',
      );
      expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
        ...updateWithPassword,
        password: 'newHashedPassword',
      });
    });

    it('should allow updating when email remains the same', async () => {
      // Arrange
      const updateSameEmail: UpdateUserDto = {
        name: 'New Name',
        email: mockUser.email, // Same email
      };
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      // Act
      await service.updateUser(updateSameEmail, mockUser.id);

      // Assert
      // findByEmail should not be called when email hasn't changed
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      const userId = mockUser.id;
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      // Act
      const result = await service.deleteUser(userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
      expect(result.affected).toBe(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.delete).not.toHaveBeenCalled();
    });
  });
});
