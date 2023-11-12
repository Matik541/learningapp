import { Flashcard, Methods, PractiseFlashcard } from 'src/app/enums/enums';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  public start?: Date = undefined;

  constructor() {}

  startQuiz() {
    this.start = new Date();
  }

  finishQuiz() {
    console.log('score calc');
    this.start = undefined;
  }

  generateBoolean(flashcards: Flashcard[]) {
    let flashcard: PractiseFlashcard = {} as PractiseFlashcard;

    flashcard.method = Methods.BOOLEAN;
    flashcard.variant = ['question', 'answer'];
    flashcard.variant.sort(() => Math.random() - 0.5);

    flashcard.question = flashcards[0][flashcard.variant[0]];

    const answer = flashcards[0][flashcard.variant[1]];
    const answerOptions = answer.split(/,|\/|\\/);

    const otherFlashcards = flashcards.filter((card) => {
      const cardAnswer = card[flashcard.variant[1]];
      const cardAnswerOptions = cardAnswer.split(/,|\/|\\/);
      return !answerOptions.some((option) => cardAnswerOptions.includes(option))
    });

    if (Math.random() > 0.5) {
      flashcard.answer = answer;
    } else {
      const otherFlashcard = otherFlashcards[Math.floor(Math.random() * otherFlashcards.length)]
      const otherAnswers = otherFlashcard[flashcard.variant[1]].split(/,|\/|\\/)
      flashcard.answer = otherAnswers[Math.floor(Math.random() * otherAnswers.length)];
    }

    return flashcard;
  }

  generateMultiple() {
    let flashcard;

    return flashcard;
  }

  generateMatch() {
    let flashcard;

    return flashcard;
  }

  generateWrite() {
    let flashcard;

    return flashcard;
  }
}
