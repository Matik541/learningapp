import { BadRequestException } from '@nestjs/common';

import { SignUpDto } from '../dto/signup.dto';
import { Tokens } from '../type/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/signin.dto';
import { User } from 'src/users/entities/user.entity';

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
const getTokens = async (id: number, userName: string): Promise<Tokens> => {
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

export const mockAuthService = {
  signUp: jest.fn().mockImplementation(async (signUpDto: SignUpDto) => {
    if (users.findIndex((u) => u.email === signUpDto.email) == -1) {
      const user = new User();
      user.id = 1;
      user.email = signUpDto.email;
      user.userName = signUpDto.userName;
      user.hashedPassword = signUpDto.hashedPassword;

      // save them in db
      users.push(user);

      // generate tokens
      return await getTokens(user.id, user.userName);
    } else {
      throw new BadRequestException('Email is already in use.');
    }
  }),

  signIn: jest.fn().mockImplementation(async (signInDto: SignInDto) => {
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
      return await getTokens(user.id, user.userName);
    } catch (err) {
      throw new BadRequestException('Bad user credentials.');
    }
  }),
};
