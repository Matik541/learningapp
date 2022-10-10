import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto
import { AddLessonDto } from './dto/addLesson.dto';

// entity
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
  ) {}

  async addLesson(lessonCreatorId: number, dto: AddLessonDto): Promise<Lesson> {
    // create lesson
    const lesson = this.lessonsRepository.create({
      creator: { id: lessonCreatorId },
      ...dto,
    });

    try {
      // save lesson in the database
      return await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
