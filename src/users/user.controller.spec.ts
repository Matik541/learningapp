import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { mockUsersService } from './mock/user.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me route', () => {
    afterEach(() => {
      expect(mockUsersService.getUserById).toBeCalled();
    });

    it('should return logged user data', async () => {
      expect(await controller.getMe(1)).toEqual({
        id: 1,
        userName: 'test user',
      });
    });

    it('user dont exist should return undefined', async () => {
      expect(await controller.getMe(2)).toBe(undefined);
    });
  });

  describe('getUserById route', () => {
    it('should return user data', async () => {
      expect(await controller.getMe(1)).toEqual({
        id: 1,
        userName: 'test user',
      });
    });

    it('user dont exist should return undefined', async () => {
      expect(await controller.getMe(2)).toBe(undefined);
    });
  });
});
