import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (process.env.APPLICATION_MODE === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }

        return {
          type: 'sqlite',
          database: 'LearningApp.db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // change to false in production mode
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    LessonsModule,
  ],
})
export class AppModule {}
