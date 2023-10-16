import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../../users/entities/user.entity';

import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';

import { TokensDto } from '../dto/tokens.dto';

const jwtService: JwtService = new JwtService();

// mock repository
const users: User[] = [];

/**
 * It takes an id and user name, generate a JWT with them as the payload and returns a promise
 * of a Tokens type.
 * @param {number} id - the user's id
 * @param {string} userName - user's name
 * @returns A promise of Tokens type
 */
const getTokens = async (id: number, userName: string): Promise<TokensDto> => {
  const userData = {
    sub: id,
    username: userName,
  };

  // get data from .env file
  const authTokenSecret = 'auth-secret';

  const refreshTokenSecret = 'refresh-secret';

  const timeExpiresIn = 60 * 60 * 24 * 7;

  // generate auth token
  const authToken = await jwtService.signAsync(userData, {
    secret: authTokenSecret,
    expiresIn: timeExpiresIn,
  });

  // generate refresh token
  const refreshToken = await jwtService.signAsync(userData, {
    secret: refreshTokenSecret,
    expiresIn: timeExpiresIn,
  });

  // return promise of Tokens type
  return {
    authToken,
    refreshToken,
  };
};

/**
 * Changes user's hashed refresh token to the new and saves.
 * @param {number} id - number - the id of the user
 * @param {string} refreshToken - string - the refresh token that was sent to the client
 * @returns The user with the new refresh token.
 */
const updateRefreshTokenAsHash = async (id: number, refreshToken: string) => {
  // hash token
  const hashedToken = await bcrypt.hash(refreshToken, 5);

  // find user by id
  const user = users.find((u) => {
    if (u.id === id) return u;
    else throw new ForbiddenException('Access denied');
  });

  // change data in hashed refresh token
  user.hashedRefreshToken = hashedToken;

  // save user with new refresh token
  return user;
};

export const mockAuthService = {
  signUp: jest
    .fn()
    .mockImplementation(async (signUpDto: SignUpDto): Promise<TokensDto> => {
      if (users.findIndex((u) => u.email === signUpDto.email) == -1) {
        const user = new User();
        user.id = 1;
        user.email = signUpDto.email;
        user.userName = signUpDto.userName;
        user.hashedPassword = signUpDto.hashedPassword;

        // save them in db
        users.push(user);

        // generate tokens
        const tokens = await getTokens(user.id, user.userName);

        await updateRefreshTokenAsHash(user.id, tokens.refreshToken);

        return tokens;
      } else {
        throw new BadRequestException('Email is already in use.');
      }
    }),

  signIn: jest
    .fn()
    .mockImplementation(async (signInDto: SignInDto): Promise<TokensDto> => {
      try {
        // find user in mock repository
        const user = users.find((u) => {
          if (
            u.email === signInDto.email &&
            u.hashedPassword === signInDto.hashedPassword
          )
            return u;
        });

        // generate tokens
        const tokens = await getTokens(user.id, user.userName);

        await updateRefreshTokenAsHash(user.id, tokens.refreshToken);

        return tokens;
      } catch (err) {
        throw new BadRequestException('Bad user credentials.');
      }
    }),

  logout: jest.fn().mockImplementation(async (id: number): Promise<void> => {
    // find user in mock repository
    const user = users.find((u) => {
      if (u.id === id) return u;
      else throw new BadRequestException('Bad request.');
    });

    // check if user is logged in
    if (user.hashedRefreshToken !== null) {
      // change user refresh token in db to null
      user.hashedRefreshToken = null;
    } else {
      throw new BadRequestException('Bad request.');
    }
  }),

  refreshToken: jest
    .fn()
    .mockImplementation(
      async (id: number, refreshToken: string): Promise<TokensDto> => {
        // find user by id
        const user = users.find((u) => {
          if (u.id === id) return u;
          else throw new ForbiddenException('Access denied');
        });

        // compare user refresh token with refresh token in db
        const tokensMatches = await bcrypt.compare(
          refreshToken,
          user.hashedRefreshToken,
        );

        // is the refresh token not matches show exception
        if (!tokensMatches) {
          throw new ForbiddenException('Access denied');
        }

        const tokens = await getTokens(user.id, user.userName);

        await updateRefreshTokenAsHash(user.id, tokens.refreshToken);

        return tokens;
      },
    ),
};
