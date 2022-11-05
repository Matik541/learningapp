import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controller
import { LessonsController } from './lessons.controller';

// service
import { LessonsService } from './lessons.service';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from './entities/tag.entity';
import { Flashcard } from './entities/flashcard.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Tag, Flashcard, User, Comment])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
