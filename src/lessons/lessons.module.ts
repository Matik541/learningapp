import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controller
import { LessonsController } from './lessons.controller';

// service
import { LessonsService } from './lessons.service';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Tag])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
