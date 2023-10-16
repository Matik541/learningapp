import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Tokens } from './type/tokens.dto';

let id = 0;

describe('AuthService', () => {
  let service: AuthService;

  // TODO: move to file
  const mockUserRepository = {
    findOneOrFail: jest.fn().mockImplementation(() => user),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((dto) => {
      id++;
      return { id, ...dto };
    }),
  };

  const user = {
    userName: 'test',
    email: 'test@gmail.com',
    hashedPassword: 'test',
  };

  let tokens: Tokens;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        AuthService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user, add to the database and return tokens', async () => {
    const res = await service.signUp(user);

    expect(res).toHaveProperty('authToken');
    expect(res).toHaveProperty('refreshToken');
  });

  it('should find user in db and return tokens', async () => {
    const res = await service.signIn(user);

    tokens = res;

    expect(res).toHaveProperty('authToken');
    expect(res).toHaveProperty('refreshToken');
  });

  it('should refresh ', async () => {
    const res = await service.refreshToken(1, tokens.refreshToken);

    expect(res).toHaveProperty('authToken');
    expect(res).toHaveProperty('refreshToken');
  });

  it('should find user and remove session data from db', async () => {
    const res = await service.logout(1);

    expect(res).toBe(undefined);
  });
});
