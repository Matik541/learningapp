import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// controller
import { LessonsController } from './lessons.controller';

// service
import { LessonsService } from './lessons.service';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Flashcard } from './entities/flashcard.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

// utils
import { JWTUtil } from '../auth/utils/jwt.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      Flashcard,
      User,
      Comment,
      LessonCompleted,
    ]),
    JwtModule.register({}),
  ],
  controllers: [LessonsController],
  providers: [LessonsService, JWTUtil],
})
export class LessonsModule {}
