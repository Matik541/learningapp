import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

// modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { FlashcardsModule } from './flashcards/flashcards.module';

@Module({
  imports: [
    // TODO: remove module use different env files
    ConfigModule.forRoot({ isGlobal: true }),

    EventEmitterModule.forRoot(),

    // TODO: remove async
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
    TagsModule,
    CommentsModule,
    FlashcardsModule,
  ],
})
export class AppModule {}
