import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'LearningApp.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // change to false in production mode
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
