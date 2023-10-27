import { Flashcard, Bar } from './../../../enums/enums';
import { Lesson, Methods, PractiseFlashcard } from 'src/app/enums/enums';
import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from './result/result.component';
import leven from 'leven';

@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent {
  @Input() lesson: Lesson | undefined = {} as Lesson;

  started: Date | undefined = undefined;

  avableMethods: Methods[] = [
    Methods.BOOLEAN,
    Methods.MULTIPLE,
    Methods.WRITE,
    /* Methods.MATCH */
  ];
  methods: { method: Methods; name: string }[] = [
    { method: Methods.BOOLEAN, name: 'boolean' },
    { method: Methods.MULTIPLE, name: 'multiple' },
    { method: Methods.MATCH, name: 'match' },
    { method: Methods.WRITE, name: 'write' },
  ];

  sizes: number[] = [3, 5, 8, 10];

  quiz: {
    size: number;
    methods: [Methods, PractiseFlashcard[]][];
    answers: (string | null)[];
  } = {
    size: this.sizes[1],
    methods: [
      [Methods.BOOLEAN, []],
      [Methods.MULTIPLE, []],
      [Methods.MATCH, []],
      [Methods.WRITE, []],
    ],
    answers: [],
  };

  private variant: ('question' | 'answer')[] = ['question', 'answer'];
  private scores: number[] = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private progressBarService: ProgressBarService
  ) {}

  generateQuiz() {
    this.started = new Date();

    let navBar = this.progressBarService.getBar('navigation');
    if (navBar) navBar.max = this.quiz.size * this.avableMethods.length;

    setTimeout(() => {
      let el = document.querySelector('.tab-content') as HTMLElement;
      if (el) el.scrollTop = 0;
    }, 50);

    this.quiz = {
      size: this.quiz.size,
      methods: [
        [Methods.BOOLEAN, []],
        [Methods.MULTIPLE, []],
        [Methods.MATCH, []],
        [Methods.WRITE, []],
      ],
      answers: [],
    };
    if (!this.lesson?.flashcards) return;

    let flashcards: PractiseFlashcard[] = [];
    let avableFlashcards = [...this.lesson.flashcards]

    for (let i = 0; i <= this.methods.length; i++) {
      avableFlashcards = [...this.lesson.flashcards].sort(() => Math.random() - 0.5);
      for (let j = 0; j < this.quiz.size; j++) {
        let flashcard: PractiseFlashcard = {} as PractiseFlashcard;

        console.log(avableFlashcards)

        switch (i) {
          case Methods.BOOLEAN:
            avableFlashcards.sort(() => Math.random() - 0.5);
            this.variant.sort(() => Math.random() - 0.5);

            let answers = avableFlashcards.filter(
              (flashcard) =>
                flashcard.answer !== avableFlashcards[0][this.variant[0]]
            );
            flashcard = {
              method: Methods.BOOLEAN,
              variant: this.variant,
              question: avableFlashcards[0][this.variant[0]],
              answer:
                Math.random() > 0.5
                  ? avableFlashcards[0][this.variant[1]]
                  : answers[Math.floor(Math.random() * answers.length)][
                      this.variant[1]
                    ],
            };
            this.quiz.methods[0][1].push(flashcard);
            break;

          case Methods.MULTIPLE:
            this.variant.sort(() => Math.random() - 0.5);

            flashcard = {
              method: Methods.MULTIPLE,
              variant: this.variant,
              question: avableFlashcards[0][this.variant[0]],
              options: [...this.lesson.flashcards]
                .filter(
                  (flashcard) =>
                    flashcard[this.variant[1]] !==
                    avableFlashcards[0][this.variant[1]]
                )
                .sort(() => Math.random() - 0.5)
                .map((flashcard) => flashcard[this.variant[1]])
                .splice(0, 3),
              answers: [...avableFlashcards]
                .filter(
                  (flashcard) =>
                    flashcard[this.variant[1]] ===
                    avableFlashcards[0][this.variant[1]]
                )
                .map((flashcard) => flashcard[this.variant[1]]),
            };
            this.quiz.methods[1][1].push(flashcard);
            break;
            
          case Methods.MATCH:
            // console.error('Match method not implemented yet')
            // avableFlashcards.sort(() => Math.random() - 0.5)
            // this.variant.sort(() => Math.random() - 0.5)
            break;

          case Methods.WRITE:
            avableFlashcards.sort(() => Math.random() - 0.5);
            this.variant.sort(() => Math.random() - 0.5);

            flashcard = {
              method: Methods.WRITE,
              variant: this.variant,
              question: avableFlashcards[0][this.variant[0]],
              answers: [...avableFlashcards]
                .filter(
                  (flashcard) =>
                    flashcard[this.variant[1]] ===
                    avableFlashcards[0][this.variant[1]]
                )
                .map((flashcard) => flashcard[this.variant[1]]),
            };
            this.quiz.methods[3][1].push(flashcard);
        }
        avableFlashcards.shift();
      }
    }
  }

  changeAnswer(method: number, index: number, answer: string | null) {
    console.log(method, index, answer);
    this.quiz.answers[method * this.quiz.size + index] = answer;

    let navBar = this.progressBarService.getBar('navigation');
    if (navBar) navBar.current = this.quiz.answers.length;
  }

  submitQuiz() {
    console.log(this.quiz.methods);

    let quiz: {
      answer: string | null;
      flashcard: PractiseFlashcard;
    }[] = [];

    for (let i = 0; i < this.quiz.methods.length; i++) {
      for (let j = 0; j < this.quiz.methods[i][1].length; j++) {
        quiz.push({
          answer: this.quiz.answers[i * this.quiz.size + j],
          flashcard: this.quiz.methods[i][1][j],
        });
      }
    }

    this.scores = [];

    console.log(quiz);

    quiz.forEach((quiz) => {
      if (!this.lesson) return;

      let score = 0;
      let avableFlashcards = [...this.lesson.flashcards];

      console.log(quiz.flashcard, quiz.answer);

      switch (quiz.flashcard.method) {
        case Methods.BOOLEAN:
          console.log(quiz.flashcard, quiz.answer);

          let flashcardExists = avableFlashcards.some((flashcard) => {
            if (
              (flashcard[quiz.flashcard.variant[0]] === quiz.flashcard.answer &&
                flashcard[quiz.flashcard.variant[1]] ===
                  quiz.flashcard.question) ||
              (flashcard[quiz.flashcard.variant[1]] === quiz.flashcard.answer &&
                flashcard[quiz.flashcard.variant[0]] ===
                  quiz.flashcard.question)
            ) {
              return true;
            }
            return false;
          });

          if (
            (flashcardExists && quiz.answer === quiz.flashcard.answer) ||
            quiz.answer === quiz.flashcard.question ||
            (!flashcardExists && quiz.answer === null)
          )
            score = 1;
          break;
        case Methods.MULTIPLE:
          if (quiz.answer)
            if (quiz.flashcard.answers?.includes(quiz.answer)) score = 1;
          break;
        case Methods.MATCH:
          break;
        case Methods.WRITE:
          if (quiz.flashcard.answers?.includes(quiz.answer ?? '')) {
            score = 1;
            break;
          }

          if (!quiz.answer) {
            score = 0;
            break;
          }

          let input = quiz.answer as string;
          let similarityScores: number[] | undefined =
            quiz.flashcard.answers?.map((value) => {
              return (
                1 -
                leven(
                  this.normalizeString(input),
                  this.normalizeString(value)
                ) /
                  Math.max(input.length, value.length)
              );
            });

          score = Math.max(...(similarityScores ?? [0]));
      }

      // console.log(score, this.answers);

      this.scores.push(score);

      // this.display = false;
      // this.round.current++;
      // setTimeout(() => {
      //   this.display = true;
      // }, 50);
    });

    console.log(this.scores);

    let resultDialog = this.dialog.open(ResultComponent, {
      data: {
        scores: this.scores,
      },
      width: '50vw',
    });

    resultDialog.afterClosed().subscribe((result) => console.log(result));
  }

  private normalizeString(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
