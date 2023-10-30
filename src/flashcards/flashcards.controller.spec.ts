import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

import { FlashcardsController } from './flashcards.controller';

import { FlashcardsService } from './flashcards.service';
import { mockFlashcardsService } from './mock/flashcards.service';

import { AddFlashcardDto } from './dto/addFlashcard.dto';

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
});
