import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';

// entity
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
  ) {}

  /**
   * Find all lessons, select only the id, title, description and include the creator's id
   * and username fields. Then return selected lessons data.
   * @returns An array of lessons
   */
  async getAllLessons(): Promise<Lesson[]> {
    // find and return all lessons
    try {
      return await this.lessonsRepository.find({
        select: {
          id: true,
          title: true,
          description: true,
          // get only id and username from creator
          creator: {
            id: true,
            userName: true,
          },
        },
        relations: {
          creator: true,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Find a lesson by id, select only the id, title, description and include the creator's id
   * and username fields. Then return lesson data
   * @param {number} id - number - the id of the lesson we want to get
   * @returns Lesson
   */
  async getLessonById(id: number): Promise<Lesson> {
    // find lesson by id and return lesson data
    try {
      return await this.lessonsRepository.findOneOrFail({
        select: {
          id: true,
          title: true,
          description: true,
          // get only id and username from creator
          creator: {
            id: true,
            userName: true,
          },
        },
        where: { id },
        relations: { creator: true },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * It creates a lesson, saves it in the database, and returns it
   * @param {number} lessonCreatorId - number - the id of the user who created the lesson
   * @param {AddLessonDto} dto - AddLessonDto
   * @returns The lesson that was created.
   */
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

  async updateLesson(lessonId: number, dto: UpdateLessonDto): Promise<Lesson> {
    // get lesson by id
    let lesson = await this.getLessonById(lessonId);

    // change data in lesson object
    lesson = Object.assign(lesson, dto);

    // save updated lesson
    try {
      return await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteLesson(lessonId: number): Promise<Lesson> {
    // get lesson by id
    const lesson = await this.getLessonById(lessonId);

    try {
      // remove lesson from db
      return await this.lessonsRepository.remove(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
