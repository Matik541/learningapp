import { BadRequestException } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { Flashcard } from '../entities/flashcard.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { AddFlashcardDto } from '../dto/addFlashcard.dto';

let flashcards: Flashcard[] = [];

const mockUser = new User();
mockUser.id = 1;

const mockLesson = new Lesson();
mockLesson.creator = mockUser;

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
          flashcard.id = 1;
          flashcard.question = card.question;
          flashcard.answer = card.answer;
          flashcard.lesson = mockLesson;

          return flashcard;
        });

        return Promise.resolve(flashcards);
      },
    ),
};
