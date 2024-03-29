import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { TokensDto } from './dto/tokens.dto';
import { mockUserRepository } from './mock/user.repository';
import { user } from './mock/user.object';

describe('AuthService', () => {
  let service: AuthService;

  let tokens: TokensDto;

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
