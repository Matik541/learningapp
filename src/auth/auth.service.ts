import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// dto
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

// entities
import { User } from 'src/users/entities/user.entity';

// types
import { Tokens } from './type/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * It creates a user and save them in the database. Then generates auth and refresh tokens and returns the them
   * @param {SignUpDto} signUpDto
   * @returns promise of Tokens type
   */
  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    // create user
    const user = await this.userRepository.create(signUpDto);

    // save them in db
    await this.userRepository.save(user);

    // generate tokens
    const tokens = await this.getTokens(user.id, user.userName);

    await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

    // return token
    return tokens;
  }

  /**
   * It takes a signInDto, finds the user by email and hashedPassword, generates and returns
   * the tokens
   * @param {SignInDto} signInDto - SignInDto
   * @returns Tokens
   */
  async signIn(signInDto: SignInDto): Promise<Tokens> {
    // find the user by email
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: signInDto.email,
        hashedPassword: signInDto.hashedPassword,
      },
    });

    // generate tokens
    const tokens = await this.getTokens(user.id, user.userName);

    await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

    // return the tokens
    return tokens;
  }

  async logout(id: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    if (user.hashedRefreshToken !== null) {
      user.hashedRefreshToken = null;

      await this.userRepository.save(user);
    }
  }

  async refreshToken(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const tokensMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!tokensMatches) {
      throw new ForbiddenException('Access denied');
    }

    // generate tokens
    const tokens = await this.getTokens(user.id, user.userName);

    await this.updateRefreshTokenAsHash(user.id, tokens.refreshToken);

    // return the tokens
    return tokens;
  }

  /**
   * It takes an id and email, generate a JWT with them as the payload and returns a promise
   * of a Tokens type.
   * @param {number} id - the user's id
   * @param {string} userName - user's name
   * @returns A promise of Tokens type
   */
  async getTokens(id: number, userName: string): Promise<Tokens> {
    // generate auth token
    const authToken = await this.jwtService.signAsync(
      {
        sub: id,
        username: userName,
      },
      {
        secret: 'auth-secret',
        expiresIn: 60 * 60 * 24 * 7,
      },
    );

    // generate refresh token
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        username: userName,
      },
      {
        secret: 'refresh-secret',
        expiresIn: 60 * 60 * 24 * 7,
      },
    );

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

    // find user
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    // change data in hashed refresh token
    user.hashedRefreshToken = hashedToken;

    // save user with new refresh token
    return await this.userRepository.save(user);
  }
}
