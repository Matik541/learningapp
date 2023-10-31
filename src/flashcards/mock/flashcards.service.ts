import { BadRequestException } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { Flashcard } from '../entities/flashcard.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { AddFlashcardDto } from '../dto/addFlashcard.dto';
import { UpdateFlashcardDto } from '../dto/updateFlashcard.dto';

let flashcards: Flashcard[] = [];

const mockUser = new User();
mockUser.id = 1;

const mockLesson = new Lesson();
mockLesson.creator = mockUser;

let id = 1;

export const mockFlashcardsService = {
  addFlashcardsToLesson: jest
    .fn()
    .mockImplementation(
      async (
        lessonCreatorId: number,
        lessonId: number,
        flashcardsData: AddFlashcardDto[],
      ): Promise<Flashcard[]> => {
        if (mockLesson.creator.id !== lessonCreatorId)
          throw new BadRequestException('Invalid user');

        flashcards = flashcardsData.map((card) => {
          const flashcard = new Flashcard();
          flashcard.id = id;
          flashcard.question = card.question;
          flashcard.answer = card.answer;
          flashcard.lesson = mockLesson;

          id++;

          return flashcard;
        });

        return Promise.resolve(flashcards);
      },
    ),
  updateFlashcard: jest
    .fn()
    .mockImplementation(
      async (
        lessonCreatorId: number,
        lessonId: number,
        flashcardId: number,
        updateFlashcardDto: UpdateFlashcardDto,
      ): Promise<Flashcard> => {
        if (mockLesson.creator.id !== lessonCreatorId)
          throw new BadRequestException('Invalid user');

        let res: Flashcard;

        flashcards = flashcards.map((f) => {
          if (f.id == flashcardId) {
            f = {
              ...f,
              question: updateFlashcardDto.question,
              answer: updateFlashcardDto.answer,
            };

            res = f;

            return f;
          }
        });

        return Promise.resolve(res);
      },
    ),

  removeFlashcard: jest
    .fn()
    .mockImplementation(
      async (
        lessonCreatorId: number,
        lessonId: number,
        flashcardId: number,
      ): Promise<Flashcard> => {
        if (mockLesson.creator.id !== lessonCreatorId)
          throw new BadRequestException('Invalid user');

        const flashcard = flashcards.find(
          (flashcard) => flashcard.id === flashcardId,
        );

        flashcards = flashcards.filter((f) => f !== flashcard);

        return Promise.resolve(flashcard);
      },
    ),
};
