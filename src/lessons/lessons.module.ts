import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// controller
import { LessonsController } from './lessons.controller';

// service
import { LessonsService } from './lessons.service';

// entity
import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

// utils
import { JWTUtil } from '../auth/utils/jwt.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, LessonCompleted]),
    JwtModule.register({}),
  ],
  controllers: [LessonsController],
  providers: [LessonsService, JWTUtil, Logger],
  exports: [LessonsService],
})
export class LessonsModule {}
