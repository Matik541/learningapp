import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// controllers
import { AuthController } from './auth.controller';

// entities
import { User } from 'src/users/entities/user.entity';

// services
import { AuthService } from './auth.service';

// strategies
import { AuthTokenStrategy } from './strategies/authToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
