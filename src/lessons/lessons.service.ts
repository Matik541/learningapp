import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { AddTagDto } from './dto/addTag.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { Flashcard } from './entities/flashcard.entity';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Flashcard)
    private flashcardRepository: Repository<Flashcard>,
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
          tags: true,
          flashcards: true,
        },
        relations: { creator: true, tags: true, flashcards: true },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * It return all lessons filtered by given tags
   * @param {GetAllLessonsQueryParametersDto} query - GetAllLessonsQueryParametersDto
   * @returns Lessons
   */
  async getAllLessonsWithFilters(
    tagIds: number[],
    lessonsSearched: Promise<Lesson[]> | undefined,
  ): Promise<Lesson[]> {
    let lessons;

    // get lessons
    if (typeof lessonsSearched === 'undefined') {
      lessons = await this.getAllLessons();
    } else {
      lessons = await lessonsSearched;
    }

    // get tags by ids
    const tags = await this.tagRepository.find({
      where: {
        id: In(tagIds),
      },
    });

    // filter lessons by tags
    tags.forEach((tag) => {
      lessons = lessons.filter((lesson) => {
        if (JSON.stringify(lesson.tags).includes(JSON.stringify(tag))) {
          return lesson;
        }
      });
    });

    // return filtered lessons
    return lessons;
  }

  async getSearchedLessons(searchBy: string): Promise<Lesson[]> {
    const lessons = await this.lessonsRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        // get only id and username from creator
        creator: {
          id: true,
          userName: true,
        },
        tags: true,
        flashcards: true,
      },
      where: [
        { title: Like('%' + searchBy + '%') },
        { description: Like('%' + searchBy + '%') },
      ],
      relations: { creator: true, tags: true, flashcards: true },
    });

    return lessons;
  }

  /**
   * It returns a promise of an array of Tag objects
   * @returns An array of Tag objects
   */
  async getTags(): Promise<Tag[]> {
    // find and return all tags
    try {
      return await this.tagRepository.find();
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
          tags: true,
          flashcards: true,
        },
        where: { id },
        relations: { creator: true, tags: true, flashcards: true },
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
    const flashcards = [];

    for (let i = 0; i < dto.flashcards.length; i++) {
      // create flashcards object
      const flashcard = this.flashcardRepository.create(dto.flashcards[i]);

      // save them in the database
      await this.flashcardRepository.save(flashcard);

      flashcards.push(flashcard);
    }

    delete dto.flashcards;

    // create lesson object
    const lesson = this.lessonsRepository.create({
      creator: { id: lessonCreatorId },
      flashcards: flashcards,
      ...dto,
    });

    try {
      // save lesson to the database
      return await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async addTag(addTagDto: AddTagDto): Promise<Tag> {
    // create tag object
    const tag = await this.tagRepository.create(addTagDto);

    try {
      // save tag to the db
      return this.tagRepository.save(tag);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * We get the lesson by id, check if logger user is the author, change the data in the lesson object,
   * and save the updated lesson
   * @param {number} creatorId - number - the id of the logged user
   * @param {number} lessonId - number - the id of the lesson to be updated
   * @param {UpdateLessonDto} dto - UpdateLessonDto - this is the data transfer object that we will
   * create in the next step.
   * @returns A promise of a lesson
   */
  async updateLesson(
    creatorId: number,
    lessonId: number,
    dto: UpdateLessonDto,
  ): Promise<Lesson> {
    // get lesson by id
    let lesson = await this.getLessonById(lessonId);

    // check is lesson author
    if (lesson.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // change data in lesson object
    lesson = Object.assign(lesson, dto);

    // save updated lesson
    try {
      return await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It deletes a lesson from the database
   * @param {number} creatorId - number - the id of the logged user
   * @param {number} lessonId - number - the id of the lesson to be deleted
   * @returns The lesson that was deleted.
   */
  async deleteLesson(creatorId: number, lessonId: number): Promise<Lesson> {
    // get lesson by id
    const lesson = await this.getLessonById(lessonId);

    // check is lesson author
    if (lesson.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    try {
      // remove lesson from db
      return await this.lessonsRepository.remove(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
