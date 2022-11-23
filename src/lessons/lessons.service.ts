import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { AddTagDto } from './dto/tag/addTag.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { AddFlashcardDto } from './dto/flashcard/addFlashcard.dto';
import { AddCommentDto } from './dto/comment/addComment.dto';
import { UpdateCommentDto } from './dto/comment/updateComment.dto';
import { LessonCompletedDto } from './dto/lessonCompleted.dto';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from './entities/tag.entity';
import { Flashcard } from './entities/flashcard.entity';
import { Comment } from './entities/comment.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Flashcard)
    private flashcardRepository: Repository<Flashcard>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(LessonCompleted)
    private lessonCompletedRepository: Repository<LessonCompleted>,
  ) {}

  // find lesson in db parameters
  private readonly getLessonFindParameters = {
    select: {
      id: true,
      title: true,
      description: true,
      iconPath: true,
      // get only id and username from creator
      creator: {
        id: true,
        userName: true,
      },
      tags: true,
      flashcards: true,
      comments: {
        id: true,
        creator: {
          id: true,
          userName: true,
        },
        comment: true,
      },
    },
    relations: {
      creator: true,
      tags: true,
      flashcards: true,
      comments: {
        creator: true,
      },
    },
  };

  /**
   * Find all lessons, select only the id, title, description and include the creator's id
   * and username fields. Then return selected lessons data.
   * @returns An array of lessons.
   */
  async getAllLessons(userId: number | undefined): Promise<Lesson[]> {
    let lessons: Lesson[];

    // find and return all lessons
    try {
      lessons = await this.lessonsRepository.find({
        ...this.getLessonFindParameters,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (userId !== undefined) {
      // add user score to the lessons data
      lessons = await Promise.all(
        lessons.map(async (lesson: Lesson): Promise<Lesson> => {
          const lessonCompleted = await this.getLessonCompleted(
            userId,
            lesson.id,
          );

          if (lessonCompleted !== null) {
            lesson.score = lessonCompleted.score;
          }

          return lesson;
        }),
      );
    }

    return lessons;
  }

  async getAllLessonsWithFilters(
    userId: number | undefined,
    tagIds: number[],
    lessonsSearched: Promise<Lesson[]> | undefined,
  ): Promise<Lesson[]> {
    // get lessons
    let lessons =
      typeof lessonsSearched === 'undefined'
        ? await this.getAllLessons(userId)
        : await lessonsSearched;

    // get tags by ids
    const tags = await this.getLessonTags(tagIds);

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

  /**
   * It returns all lessons where the searchBy string is found in the title or description.
   * @param {string} searchBy - string - the string we're searching for.
   * @returns Lessons where the searchBy string is found in the title or description.
   */
  async getSearchedLessons(searchBy: string): Promise<Lesson[]> {
    // return lessons where find key words in title or description
    try {
      return await this.lessonsRepository.find({
        where: [
          { title: Like('%' + searchBy + '%') },
          { description: Like('%' + searchBy + '%') },
        ],
        ...this.getLessonFindParameters,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It returns a promise of an array of Tag objects.
   * @returns An array of Tag objects.
   */
  async getTags(): Promise<Tag[]> {
    // find and return all tags
    try {
      return await this.tagRepository.find();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Find a lesson by id, select only the id, title, description and include the creator's id
   * and username fields. Then return lesson data.
   * @param {number} id - number - the id of the lesson we want to get.
   * @returns Lesson object.
   */
  async getLessonById(id: number): Promise<Lesson> {
    // find lesson by id and return lesson data
    try {
      return await this.lessonsRepository.findOneOrFail({
        where: { id },
        ...this.getLessonFindParameters,
      });
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
    dto.flashcards = await this.addFlashcards(dto.flashcards);

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
   * It creates a new tag object and them in the database.
   * @param {AddTagDto} addTagDto - AddTagDto - this is the DTO that we created earlier.
   * @returns The tag object that was created and saved to the db.
   */
  async addTag(addTagDto: AddTagDto): Promise<Tag> {
    // create tag object
    const tag = this.tagRepository.create(addTagDto);

    try {
      // save tag in db
      return await this.tagRepository.save(tag);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async addComment(
    commentCreatorId: number,
    lessonId: number,
    dto: AddCommentDto,
  ): Promise<Comment> {
    // create comment object
    const comment = this.commentRepository.create({
      creator: { id: commentCreatorId },
      lesson: { id: lessonId },
      ...dto,
    });

    try {
      // save comment in db
      return await this.commentRepository.save(comment);
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

    dto.flashcards = await this.updateLessonFlashcards(dto.flashcards);

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
    await this.removeFlashcardsWithoutLesson();

    return lesson;
  }

  async updateComment(
    creatorId: number,
    commentId: number,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    // get comment by id
    let comment = await this.commentRepository.findOneOrFail({
      select: {
        id: true,
        comment: true,
        creator: {
          id: true,
          userName: true,
        },
      },
      where: { id: commentId },
      relations: {
        creator: true,
      },
    });

    // check is comment author
    if (comment.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // change data in comment object
    comment = Object.assign(comment, dto);

    // save updated comment
    try {
      return await this.commentRepository.save(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
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
    if (lesson.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // delete lesson flashcards
    await this.flashcardRepository.delete({ id: lesson.id });

    // delete lesson comments
    await this.commentRepository.delete({ lesson: lesson });

    // delete users score
    await this.lessonCompletedRepository.delete({ lesson: lesson });

    try {
      // remove lesson from db
      await this.lessonsRepository.remove(lesson);
    } catch (err) {
      throw new BadRequestException(err);
    }

    return lesson;
  }

  async deleteComment(creatorId: number, commentId: number): Promise<Comment> {
    // get comment by id
    const comment = await this.commentRepository.findOneOrFail({
      select: {
        id: true,
        comment: true,
        creator: {
          id: true,
          userName: true,
        },
      },
      where: { id: commentId },
      relations: {
        creator: true,
      },
    });

    // check is comment author
    if (comment.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    try {
      // remove comment from db
      return await this.commentRepository.remove(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * "Get the lesson completed for the given user and lesson."
   * The function is async, so it returns a promise. The function returns a LessonCompleted object or
   * null
   * @param {number} userId - number,
   * @param {number} lessonId - number - The id of the lesson that the user is trying to complete.
   * @returns A lesson completed object
   */
  async getLessonCompleted(
    userId: number,
    lessonId: number,
  ): Promise<LessonCompleted> | null {
    try {
      return await this.lessonCompletedRepository.findOne({
        where: { lesson: { id: lessonId }, user: { id: userId } },
        relations: {
          lesson: true,
          user: true,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
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
      // save user score comment
      return await this.lessonCompletedRepository.save(lessonCompleted);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It takes an array of flashcards data from dto, creates a flashcard objects, saves them in the
   * database and returns their objects.
   * @param {AddFlashcardDto[]} flashcardsData - AddFlashcard[]
   * @returns An array of flashcards objects
   */
  private async addFlashcards(
    flashcardsData: AddFlashcardDto[],
  ): Promise<Flashcard[]> {
    const flashcards = [];

    let flashcard: Flashcard;
    for (let i = 0; i < flashcardsData.length; i++) {
      flashcard = await this.addFlashcard(flashcardsData[i]);

      flashcards.push(flashcard);
    }

    return flashcards;
  }

  private async addFlashcard(flashcardData: AddFlashcardDto) {
    // create flashcards object
    const flashcard = this.flashcardRepository.create(flashcardData);

    try {
      // save them in the database
      return await this.flashcardRepository.save(flashcard);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * "Get all the tags that are associated with the lesson."
   * The function takes an array of tag ids and returns an array of tags.
   * @param {number[]} tagIds - number[] - an array of tag ids
   * @returns An array of tags
   */
  private async getLessonTags(tagIds: number[]): Promise<Tag[]> {
    let tags: Tag[];

    try {
      tags = await this.tagRepository.find({
        where: {
          id: In(tagIds),
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    return tags;
  }

  /**
   * It takes an array of flashcards data, for each flashcard it calls the updateFlashcard function
   * and returns array of updated flashcards.
   * @param {Flashcard[]} flashcardsData - Flashcard[].
   * @returns An array of updated flashcards objects.
   */
  private async updateLessonFlashcards(
    flashcardsData: Flashcard[],
  ): Promise<Flashcard[]> {
    const flashcards = [];

    // update flashcards
    if (typeof flashcardsData !== 'undefined') {
      for (let i = 0; i < flashcardsData.length; i++) {
        // get flashcard from db
        const originalFlashcard = await this.flashcardRepository.findOneBy({
          id: flashcardsData[i].id,
        });

        if (originalFlashcard !== null) {
          flashcards.push(
            await this.updateFlashcard(originalFlashcard, flashcardsData[i]),
          );
        } else {
          flashcards.push(await this.addFlashcard(flashcardsData[i]));
        }
      }
    }

    return flashcards;
  }

  /**
   * It takes a flashcard object as an argument, finds the flashcard in the database by id, updates the
   * flashcard data, and saves the updated flashcard in the database.
   * @param {Flashcard} flashcardData - Flashcard - this is the data that we're going to update the.
   * flashcard with.
   * @returns Flashcard.
   */
  private async updateFlashcard(
    originalFlashcard: Flashcard,
    flashcardData: Flashcard,
  ): Promise<Flashcard> {
    // update flashcard data
    originalFlashcard = { ...flashcardData };

    try {
      // save updated flashcard in the db
      return await this.flashcardRepository.save(originalFlashcard);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private async removeFlashcardsWithoutLesson() {
    try {
      // delete flashcards with lesson
      await this.flashcardRepository.delete({ lesson: IsNull() });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
