import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

// dto
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

// entities
import { User } from '../users/entities/user.entity';

// types
import { Tokens } from './type/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * It creates a user and save them in the database. Then generates auth and refresh tokens then returns them.
   * @param {SignUpDto} signUpDto
   * @returns promise of Tokens type
   */
  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    // create user
    const user = this.userRepository.create(signUpDto);

    try {
      // save them in db
      await this.userRepository.save(user);
      // generate tokens
      const tokens = await this.getTokens(user.id, user.userName);

      // update user refresh token in db
      await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new BadRequestException('Email is already in use.');
    }
  }

  /**
   * It takes a signInDto, finds the user by email and hashedPassword, generates and returns
   * the tokens
   * @param {SignInDto} signInDto - SignInDto
   * @returns Tokens
   */
  async signIn(signInDto: SignInDto): Promise<Tokens> {
    try {
      // find the user by email
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: signInDto.email,
          hashedPassword: signInDto.hashedPassword,
        },
      });

      // generate tokens
      const tokens = await this.getTokens(user.id, user.userName);

      // update user refresh token in db
      await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new BadRequestException('Bad user credentials.');
    }
  }

  /**
   * Find user by id, check if user is logged in and change user refresh token in db to null, save
   * new refresh token value in db.
   * @param {number} id - number - the id of the user to log out
   */
  async logout(id: number): Promise<void> {
    try {
      // find user by id
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      // check if user is logged in
      if (user.hashedRefreshToken !== null) {
        // change user refresh token in db to null
        user.hashedRefreshToken = null;

        // save new refresh token value in db
        await this.userRepository.save(user);
      }
    } catch (err) {
      throw new BadRequestException('Bad request.');
    }
  }

  /**
   * It takes a user id and a refresh token, finds the user in the database, compares the refresh token
   * with the one in the database, generates new tokens, and updates the refresh token in the database
   * @param {number} id - number - the user id
   * @param {string} refreshToken - string - the refresh token that was sent from the client
   * @returns Tokens
   */
  async refreshToken(id: number, refreshToken: string): Promise<Tokens> {
    // find user by id
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    // check is user exists
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // compare user refresh token with refresh token in db
    const tokensMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    // is the refresh token not matches show exception
    if (!tokensMatches) {
      throw new ForbiddenException('Access denied');
    }

    // generate tokens
    const tokens = await this.getTokens(user.id, user.userName);

    // update user refresh token in db
    await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * It takes an id and user name, generate a JWT with them as the payload and returns a promise
   * of a Tokens type.
   * @param {number} id - the user's id
   * @param {string} userName - user's name
   * @returns A promise of Tokens type
   */
  async getTokens(id: number, userName: string): Promise<Tokens> {
    const userData = {
      sub: id,
      username: userName,
    };

    // get data from .env file
    const authTokenSecret =
      this.configService.get<string>('SECRET_AUTH') || 'auth-secret';

    const refreshTokenSecret =
      this.configService.get<string>('SECRET_REFRESH') || 'refresh-secret';

    const timeExpiresIn =
      this.configService.get<number>('TOKEN_TIME_EXPIRES_IN') ||
      60 * 60 * 24 * 7;

    // generate auth token
    const authToken = await this.jwtService.signAsync(userData, {
      secret: authTokenSecret,
      expiresIn: timeExpiresIn,
    });

    // generate refresh token
    const refreshToken = await this.jwtService.signAsync(userData, {
      secret: refreshTokenSecret,
      expiresIn: timeExpiresIn,
    });

    // return promise of Tokens type
    return {
      authToken,
      refreshToken,
    };
  }

  /**
   * Changes user's hashed refresh token to the new and saves.
   * @param {number} id - number - the id of the user
   * @param {string} refreshToken - string - the refresh token that was sent to the client
   * @returns The user with the new refresh token.
   */
  async updateRefreshTokenAsHash(id: number, refreshToken: string) {
    // hash token
    const hashedToken = await bcrypt.hash(refreshToken, 5);

    try {
      // find user by id
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      // change data in hashed refresh token
      user.hashedRefreshToken = hashedToken;

      // save user with new refresh token
      return await this.userRepository.save(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
