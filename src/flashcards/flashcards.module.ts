import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Flashcard } from './entities/flashcard.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Flashcard, Lesson]), LessonsModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
