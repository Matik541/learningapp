import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/lessons.service';
import { UsersService } from 'src/app/users.service';
import { Flashcard, Lesson, User } from 'src/environments/environment';
import { ResultComponent } from './result/result.component';
@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  id: number = 0;
  private sub: any;
  private lec: any;

  logged: User = {} as User;
  lesson: Lesson = {} as Lesson;
  quizQuestions: {
    write: string[];
    match: { question: string; answers: string[] }[];
    choose: Flashcard[];
  } = { write: [], match: [], choose: [] };

  answers: any[][] = [[], [], []];

  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private usersService: UsersService,
    private lessonsService: LessonsService
  ) {
    this.logged = this.usersService.loggedUser;
    this.sub = this.activeRoute.params.subscribe((params) => {
      this.id = +params['id'];
    });
  }

  ngOnInit(): void {
    this.lec = this.lessonsService.getLesson(this.id).subscribe((data) => {
      if (data != null) {
        this.lesson = data;
        this.quizQuestions.write = this.setWrite(
          Math.min(5, this.lesson.flashcards.length)
        );
        this.quizQuestions.match = this.setMatch(
          Math.min(5, this.lesson.flashcards.length)
        );
        this.quizQuestions.choose = this.setChoose(
          Math.min(5, this.lesson.flashcards.length)
        );
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.lec.unsubscribe();
  }

  setWrite(amount: number): string[] {
    //   let write: string[] = [];
    //   for (let i = 0; i < bound; i++) {
    //     let index = Math.floor(Math.random() * this.lesson.flashcards.length);
    //     if (write.includes(this.lesson.flashcards[index].question)) i--;
    //     else write.push(this.lesson.flashcards[index].question);
    //   }
    return [];
  }
  setMatch(amount: number): { question: string; answers: string[] }[] {
    //   let match: { question: string; answers: string[] }[] = [];
    //   for (let i = 0; i < bound; i++) {
    //     let question: Flashcard =
    //       this.lesson.flashcards[
    //         Math.floor(Math.random() * this.lesson.flashcards.length)
    //       ];
    //     if (match.map((q) => q.question).includes(question.question)) {
    //       i--;
    //       continue;
    //     }
    //     let answers = this.lesson.flashcards.map((f) => f.answer);
    //     answers = answers.filter((a) => a !== question.answer);
    //     answers.length = 4;
    //     answers[Math.floor(Math.random() * answers.length)] = question.answer;
    //     answers.sort(() => Math.random() - 0.5);
    //     match.push({ question: question.question, answers: answers });
    //   }
    return [];
  }
  setChoose(amount: number): Flashcard[] {
    //   let choose: Flashcard[] = [];
    //   for (let i = 0; i < bound; i++) {
    //     let answers: string[] = this.lesson.flashcards.map((f) => f.answer);
    //     let flashcard = this.lesson.flashcards[this.random(answers.length)];
    //     if (choose.map((q) => q.question).includes(flashcard.question)) {
    //       i--;
    //       continue;
    //     }
    //     let question: Flashcard = {
    //       question: flashcard.question,
    //       answer: flashcard.answer,
    //     };
    //     answers = answers.filter((a) => a !== question.answer);
    //     if (Math.random() < 0.5)
    //       question.answer = answers[this.random(answers.length)];
    //     choose.push(question);
    //   }
    return [];
  }

  submit(): void {
    let allAnswers: {
      question: string;
      answer: string | undefined;
      correctAnswer: string;
    }[][] = [[], [], []];
    // let correct: number = 0;
    // let incorrect: number = 0;

    // writing
    this.quizQuestions.write.forEach((question, index) => {
      let flashcards = this.lesson.flashcards.filter(
        (card) => card.question === question
      );
      if (flashcards) {
        let flashcard =
          flashcards.find((card) => card.answer === this.answers[0][index]) ??
          flashcards[0];

        allAnswers[0].push({
          question,
          answer: this.answers[0][index],
          correctAnswer: flashcard.answer,
        });
      }
    });

    // matching
    this.quizQuestions.match.forEach((question, index) => {
      let flashcards = this.lesson.flashcards.filter(
        (card) => card.question === question.question
      );

      if (flashcards) {
        let flashcard = flashcards[0];
        if (flashcards.length > 1)
          flashcard = flashcards.filter((card) =>
            question.answers.includes(card.answer)
          )[0];
        allAnswers[1].push({
          question: question.question,
          answer: this.answers[1][index],
          correctAnswer: flashcard.answer,
        });
      }
    });

    // choosing
    this.quizQuestions.choose.forEach((question, index) => {
      let flashcard = this.lesson.flashcards.filter(
        (card) => card.question === question.question
      );
      if (flashcard) {
        let correctAnswer = false;

        if (
          (this.answers[2][index] == 'true' &&
            !!flashcard.find((card) =>
              card.answer.includes(question.answer)
            )) ||
          (this.answers[2][index] == 'false' &&
            !flashcard.find((card) => card.answer.includes(question.answer)))
        )
          correctAnswer = true;

        allAnswers[2].push({
          question: question.question,
          answer: correctAnswer
            ? flashcard[0].answer
            : this.answers[2][index] != undefined
            ? this.answers[2][index] == 'true'
              ? question.answer
              : ''
            : undefined,
          correctAnswer: flashcard[0].answer,
        });
      }
    });
    this.dialog.open(ResultComponent, {
      width: '50vw',
      enterAnimationDuration: '50ms',
      exitAnimationDuration: '50ms',
      data: {
        allAnswers,
        answers: this.answers,
        total:
          this.quizQuestions.write.length +
          this.quizQuestions.match.length +
          this.quizQuestions.choose.length,
      },
    });
  }

  chooseAnswer(event: string, id: number): void {
    this.answers[2][id] = event;
  }

  matchAnswer(event: string, id: number): void {
    this.answers[1][id] = event;
  }

  writeAnswer(event: string, id: number): void {
    this.answers[0][id] = event;
  }

  random(bound: number, offset: number = 0): number {
    return Math.floor(Math.random() * bound) + offset;
  }
}
