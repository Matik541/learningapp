import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockAuthService } from './mock/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

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

    it('should return tokens', async () => {
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

      // validate data like a dto decorator
      const ofSingUpDto = plainToInstance(SignUpDto, singUpDataWithBadEmail);
      const err = await validate(ofSingUpDto);

      expect(err.length).toBe(1);
      expect(JSON.stringify(err)).toContain('email must be an email');
    });
  });

  describe('sign in', () => {
    const singInData: SignInDto = {
      email: 'email@gmail.com',
      hashedPassword: 'password',
    };

    afterEach(() => {
      // expect that mock service will be called
      expect(mockAuthService.signIn).toHaveBeenCalled();
    });

    it('should return tokens', async () => {
      // expect that authController return tokens
      const tokens = await authController.signIn(singInData);
      expect(tokens).toHaveProperty('authToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should fail because bad credentials', async () => {
      const singUpDataWithBadEmail: SignInDto = singInData;
      singUpDataWithBadEmail.email = 'bad-email';

      await expect(authController.signIn(singInData)).rejects.toThrowError(
        new BadRequestException('Bad user credentials.'),
      );
    });

    it('should fail because validation', async () => {
      const singInDataWithBadEmail: SignInDto = singInData;
      singInDataWithBadEmail.email = 'bad-email';

      // validate data like a dto decorator
      const ofSingInDto = plainToInstance(SignInDto, singInDataWithBadEmail);
      const err = await validate(ofSingInDto);

      expect(err.length).toBe(1);
      expect(JSON.stringify(err)).toContain('email must be an email');
    });
  });

  describe('log out', () => {
    afterEach(() => {
      // expect that mock service will be called
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should log out', async () => {
      // it should log out without errors
      expect(await authController.logout(1)).toBe(undefined);
    });

    it('should fail', async () => {
      // fails if user not exist
      await expect(authController.logout(6)).rejects.toThrowError(
        new BadRequestException('Bad request.'),
      );
    });
  });
});
