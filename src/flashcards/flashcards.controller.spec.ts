import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

import { FlashcardsController } from './flashcards.controller';

import { FlashcardsService } from './flashcards.service';
import { mockFlashcardsService } from './mock/flashcards.service';

import { AddFlashcardDto } from './dto/addFlashcard.dto';
import { UpdateFlashcardDto } from './dto/updateFlashcard.dto';

describe('FlashcardsController', () => {
  let controller: FlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [
        {
          provide: FlashcardsService,
          useValue: mockFlashcardsService,
        },
      ],
    }).compile();

    controller = module.get<FlashcardsController>(FlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add flashcard route', () => {
    it('should add flashcard', async () => {
      expect(
        await controller.addFlashcardsToLesson(1, 1, [
          { question: 'flascard', answer: 'test' },
        ]),
      ).toEqual([
        {
          id: expect.any(Number),
          question: 'flascard',
          answer: 'test',
          lesson: { creator: { id: 1 } },
        },
      ]);
    });

    it('should fail validation', async () => {
      const addFlashcardsWithBadData: AddFlashcardDto = new AddFlashcardDto();
      addFlashcardsWithBadData.answer = '';

      const err = await validate(addFlashcardsWithBadData);

      expect(err.length).toBe(2);
    });
  });

  describe('update flashcards route', () => {
    it('should update lesson flashcard', async () => {
      expect(
        await controller.updateFlashcard(1, 1, 1, {
          question: 'updated flascard',
          answer: 'test',
        }),
      ).toEqual({
        id: 1,
        question: 'updated flascard',
        answer: 'test',
        lesson: { creator: { id: 1 } },
      });
    });

    it('should fail validation', async () => {
      const updateFlashcardsWithBadData: UpdateFlashcardDto =
        new UpdateFlashcardDto();
      updateFlashcardsWithBadData.answer = '';

      const err = await validate(updateFlashcardsWithBadData);

      expect(err.length).toBe(2);
    });
  });

  it('should delete flashcard by id', async () => {
    expect(await controller.removeFlashcard(1, 1, 1)).toEqual({
      id: 1,
      question: 'updated flascard',
      answer: 'test',
      lesson: { creator: { id: 1 } },
    });
  });
});
