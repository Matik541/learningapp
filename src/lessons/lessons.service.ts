import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { LessonCompletedDto } from './dto/lessonCompleted.dto';
import { GetAllLessonsQueryParametersDto } from './dto/getAllLessonsQueryParameters.dto';

// entity
import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
    @InjectRepository(LessonCompleted)
    private lessonCompletedRepository: Repository<LessonCompleted>,
  ) {}

  // find lesson in db parameters
  private readonly getLessonSelectParameters = [
    'lessons.id',
    'lessons.title',
    'lessons.description',
    'lessons.iconPath',
    'creator.id',
    'creator.userName',
    'comment.creator.id',
    'comment.creator.userName',
  ];

  async getAllLessons(
    userId: number | undefined | null = null,
    queryParams: GetAllLessonsQueryParametersDto | undefined | null = null,
  ): Promise<Lesson[]> {
    let lessons = this.lessonsRepository
      .createQueryBuilder('lessons')
      .select(this.getLessonSelectParameters);

    lessons = this.getUserScore(lessons, userId);

    // create a sub query that find lessons with chosen tags
    // then filter lessons by sub query
    if (queryParams.tagIds !== undefined && queryParams.searchQuery !== null) {
      const subQuery = this.lessonsRepository
        .createQueryBuilder('l')
        .select('l.id')
        .innerJoin('l.tags', 't');

      if (
        Array.isArray(queryParams.tagIds) === true &&
        queryParams.tagIds.length > 0
      ) {
        subQuery
          .where('t.id IN (:...ids)', { ids: queryParams.tagIds })
          .groupBy('l.id')
          .having('COUNT(t.id) = ' + queryParams.tagIds.length);
      } else {
        subQuery.where('t.id = :id', { id: queryParams.tagIds });
      }

      lessons
        .andWhere('lessons.id IN (' + subQuery.getQuery() + ')')
        .setParameters(subQuery.getParameters());
    }

    // search lessons that have inputted text in title or description
    if (
      queryParams.searchQuery !== undefined &&
      queryParams.searchQuery !== null &&
      queryParams.searchQuery.length > 0
    ) {
      lessons
        .andWhere('lessons.title LIKE :title', {
          title: `%${queryParams.searchQuery}%`,
        })
        .andWhere('lessons.description LIKE :description', {
          description: `%${queryParams.searchQuery}%`,
        });
    }

    lessons
      .leftJoin('lessons.creator', 'creator')
      .leftJoinAndSelect('lessons.tags', 'tags')
      .leftJoinAndSelect('lessons.flashcards', 'flashcards')
      .leftJoinAndSelect('lessons.comments', 'comments')
      .leftJoin('comments.creator', 'comment.creator');

    try {
      return await lessons.getMany();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Find a lesson by id, include the creator's id
   * and username fields. Then return lesson data.
   * @param {number} lessonId - number - the id of the lesson we want to get.
   * @returns Lesson object.
   */
  async getLessonById(
    lessonId: number,
    userId: number | undefined | null = null,
  ): Promise<Lesson> {
    // find lesson by id and return lesson data
    let lessons = this.lessonsRepository
      .createQueryBuilder('lessons')
      .select(this.getLessonSelectParameters);

    lessons = this.getUserScore(lessons, userId);

    lessons
      .leftJoin('lessons.creator', 'creator')
      .leftJoinAndSelect('lessons.tags', 'tags')
      .leftJoinAndSelect('lessons.flashcards', 'flashcards')
      .leftJoinAndSelect('lessons.comments', 'comments')
      .leftJoin('comments.creator', 'comment.creator')
      .where('lessons.id = :lesson_id', { lesson_id: lessonId });

    try {
      return await lessons.getOneOrFail();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It creates a lesson, saves it in the database, and returns it.
   * @param {number} lessonCreatorId - number - the id of the user who created the lesson.
   * @param {AddLessonDto} dto - AddLessonDto.
   * @returns The lesson that was created.
   */
  async addLesson(lessonCreatorId: number, dto: AddLessonDto): Promise<Lesson> {
    // get flashcards
    // dto.flashcards = await this.addFlashcards(dto.flashcards);

    // create lesson object
    const lesson = this.lessonsRepository.create({
      creator: { id: lessonCreatorId },
      ...dto,
    });

    try {
      // save lesson in db
      return await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * We get the lesson by id, check if logger user is the author, change the data in the lesson object,
   * and save the updated lesson.
   * @param {number} creatorId - number - the id of the logged user.
   * @param {number} lessonId - number - the id of the lesson to be updated.
   * @param {UpdateLessonDto} dto - UpdateLessonDto - this is the data transfer object that we will
   * create in the next step.
   * @returns A promise of a lesson.
   */
  async updateLesson(
    creatorId: number,
    lessonId: number,
    dto: UpdateLessonDto,
  ): Promise<Lesson> {
    // get lesson by id
    let lesson = await this.getLessonById(lessonId);

    // dto.flashcards = await this.updateLessonFlashcards(dto.flashcards);

    // check is lesson author
    if (lesson.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // change data in lesson object
    lesson = Object.assign(lesson, dto);

    // save updated lesson
    try {
      lesson = await this.lessonsRepository.save(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }

    // clear useless flashcards
    // await this.removeFlashcardsWithoutLesson();

    return lesson;
  }

  /**
   * It deletes a lesson from the database.
   * @param {number} creatorId - number - the id of the logged user
   * @param {number} lessonId - number - the id of the lesson to be deleted
   * @returns The lesson that was deleted.
   */
  async deleteLesson(creatorId: number, lessonId: number): Promise<Lesson> {
    // get lesson by id
    const lesson = await this.getLessonById(lessonId);

    // check is lesson author
    if (lesson.creator.id !== creatorId)
      throw new BadRequestException('You are not allowed to update.');

    // delete users score
    await this.lessonCompletedRepository.delete({ lesson: lesson });

    // remove lesson from db
    await this.lessonsRepository.remove(lesson);

    return lesson;
  }

  /**
   * It creates a new LessonCompleted object, saves it to the database, and returns the saved object
   * @param {number} userId - number - the id of the user who completed the lesson
   * @param {number} lessonId - The id of the lesson that the user is completing.
   * @param {LessonCompletedDto} dto - LessonCompletedDto
   * @returns The lesson completed object
   */
  async lessonCompleted(
    userId: number,
    lessonId: number,
    dto: LessonCompletedDto,
  ): Promise<LessonCompleted> {
    // create lesson completed object
    const lessonCompleted = this.lessonCompletedRepository.create({
      user: { id: userId },
      lesson: { id: lessonId },
      score: dto.percent,
    });

    try {
      // save user score
      return await this.lessonCompletedRepository.save(lessonCompleted);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It takes a query builder lessons and a user id, and if the user id is not null or undefined, it adds a
   * score column to the query builder and joins the score table to the lessons table
   * @param lessons - SelectQueryBuilder<Lesson> - the query builder object
   * @param {number} userId - number - the id of the user who is logged in
   * @returns SelectQueryBuilder<Lesson>
   */
  private getUserScore(
    lessons: SelectQueryBuilder<Lesson>,
    userId: number,
  ): SelectQueryBuilder<Lesson> {
    // check is user logged
    // if logged add lesson result
    if (userId != null || userId != undefined) {
      lessons
        .addSelect('score.score')
        .leftJoin(
          'lessons.score',
          'score',
          'score.lessonId = lessons.id AND score.userId = :user_id',
          { user_id: userId },
        );
    }

    return lessons;
  }
}
