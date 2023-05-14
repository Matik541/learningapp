import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockAuthService } from './mock/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('sing up', () => {
    const singUpData: SignUpDto = {
      userName: 'userName',
      email: 'email@gmail.com',
      hashedPassword: 'password',
    };

    afterEach(() => {
      // expect that mock service will be called
      expect(mockAuthService.signUp).toHaveBeenCalled();
    });

    it('should be return tokens', async () => {
      // expect that authController return tokens
      const tokens = await authController.signUp(singUpData);
      expect(tokens).toHaveProperty('authToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should fail because email is already in use', async () => {
      await expect(authController.signUp(singUpData)).rejects.toThrowError(
        new BadRequestException('Email is already in use.'),
      );
    });

    it('should fail because validation', async () => {
      const singUpDataWithBadEmail: SignUpDto = singUpData;
      singUpDataWithBadEmail.email = 'bad-email';

      const ofSingUpDto = plainToInstance(SignUpDto, singUpDataWithBadEmail);
      const err = await validate(ofSingUpDto);

      expect(err.length).toBe(1);
      await expect(JSON.stringify(err)).toContain('email must be an email');
    });
  });
});
