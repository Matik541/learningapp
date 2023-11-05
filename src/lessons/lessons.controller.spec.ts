import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

import { LessonsController } from './lessons.controller';

import { LessonsService } from './lessons.service';

// dtos
import { AddLessonDto } from './dto/addLesson.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';

// entities
import { Lesson } from './entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Flashcard } from 'src/flashcards/entities/flashcard.entity';

const lessons: Lesson[] = [];

const mockUser = new User();
mockUser.id = 1;

let id = 1;

const score: LessonCompleted[] = [];
score[0] = new LessonCompleted();
score[0].id = 1;
score[0].score = 0;

const mockFlashcardsService = {
  addLesson: jest
    .fn()
    .mockImplementation(
      async (lessonCreatorId: number, dto: AddLessonDto): Promise<Lesson> => {
        const tag: Tag = { id: dto.tags[0].id, tagName: 'test' };

        const lesson: Lesson = {
          id: id,
          title: dto.title,
          description: dto.description,
          iconPath: dto.iconPath,
          tags: [tag],
          comments: [],
          creator: mockUser,
          score: score,
          flashcards: [],
        };

        const flashcards: Flashcard[] = dto.flashcards.map((card) => {
          return {
            id: 1,
            question: card.question,
            answer: card.answer,
            lesson: lesson,
          };
        });
        lesson.flashcards = flashcards;

        lessons.push(lesson);

        id++;

        return Promise.resolve(lesson);
      },
    ),
  updateLesson: jest
    .fn()
    .mockImplementation(
      async (
        creatorId: number,
        lessonId: number,
        dto: UpdateLessonDto,
      ): Promise<Lesson> => {},
    ),
};

describe('LessonsController', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: mockFlashcardsService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add lessons route', () => {
    it('should add lesson', async () => {
      const lessonAddDto: AddLessonDto = {
        title: 'test',
        description: 'desc',
        flashcards: [
          {
            question: 'test',
            answer: 'test',
          },
        ],
        iconPath: 'path',
        tags: [{ id: 1 }],
      };

      const lesson: Lesson = {
        ...lessonAddDto,
        id: expect.any(Number),
        creator: mockUser,
        comments: [],
        flashcards: [],
        tags: [{ id: 1, tagName: 'test' }],
        score: score,
      };

      const flashcards: Flashcard[] = [
        {
          id: 1,
          question: 'test',
          answer: 'test',
          lesson: lesson,
        },
      ];
      lesson.flashcards = flashcards;

      expect(await controller.addLesson(1, lessonAddDto)).toEqual(lesson);
    });

    it('should fail validation', async () => {
      const addFlashcardsWithBadData: AddLessonDto = new AddLessonDto();
      addFlashcardsWithBadData.title = '';

      const err = await validate(addFlashcardsWithBadData);

      expect(err.length).toBe(5);
    });
  });

  describe('update lesson route', () => {
    it('should update lesson', async () => {
      const lessonUpdateDto: UpdateLessonDto = {
        title: 'test update',
        description: 'desc update',
        iconPath: 'path',
        tags: [{ id: 1 }],
      };

      const lesson: Lesson = {
        id: 1,
        title: 'test update',
        description: 'desc update',
        iconPath: 'path',
        creator: mockUser,
        comments: [],
        flashcards: [],
        tags: [{ id: 1, tagName: 'test' }],
        score: score,
      };

      const flashcards: Flashcard[] = [
        {
          id: 1,
          question: 'test',
          answer: 'test',
          lesson: lesson,
        },
      ];
      lesson.flashcards = flashcards;

      expect(await controller.updateLesson(1, 1, lessonUpdateDto)).toEqual(
        lesson,
      );
    });
  });
});
