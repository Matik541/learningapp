import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Flashcard, Lesson } from 'src/environments/environment'
import { ResultComponent } from './result/result.component'
@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  @Input() quizQuestions: any[][] = []

  answers: any[][] = [[], [], []]

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  submit(): void {
    let correctAnswers: {
      question: string
      answer: string
      correctAnswer: string
    }[][] = [[], [], []]
    let correct: number = 0
    let incorrect: number = 0

    // writing
    this.quizQuestions[0].forEach((question, index) => {
      let flashcard = this.lesson.flashcards.find(
        (card) => card.question === question
      )
      if (flashcard) {
        if (flashcard.answer === this.answers[0][index]) correct++
        if (this.answers[1][index] !== undefined) incorrect++
        correctAnswers[0].push({
          question,
          answer: this.answers[0][index],
          correctAnswer: flashcard.answer,
        })
      }
    })

    // matching
    this.quizQuestions[1].forEach((question, index) => {
      let flashcard = this.lesson.flashcards.find(
        (card) => card.question === question.question
      )
      if (flashcard) {
        if (flashcard.answer === this.answers[0][index]) correct++
        if (this.answers[1][index] !== undefined) incorrect++
        correctAnswers[1].push({
          question,
          answer: this.answers[1][index],
          correctAnswer: flashcard.answer,
        })
      }
    })

    // choosing
    this.quizQuestions[2].forEach((question, index) => {
      let flashcard = this.lesson.flashcards.find(
        (card) => card.question === question.question
      )
      if (flashcard) {
        if (
          (this.answers[2][index] == 'true' &&
            flashcard.answer === question.answer) ||
          (this.answers[2][index] == 'false' &&
            flashcard.answer !== question.answer)
        )
          correct++
        else if (this.answers[2][index] !== undefined) incorrect++

        correctAnswers[2].push({
          question: question.question,
          answer: this.answers[2][index],
          correctAnswer: flashcard.answer,
        })
      }
    })

    this.dialog.open(ResultComponent, {
      width: '50vw',
      enterAnimationDuration: '50ms',
      exitAnimationDuration: '50ms',
      data: {
        correctAnswers,
        correct,
        incorrect,
        total:
          this.quizQuestions[0].length +
          this.quizQuestions[1].length +
          this.quizQuestions[2].length,
      },
    })
  }

  chooseAnswer(event: string, id: number): void {
    this.answers[2][id] = event
  }

  matchAnswer(event: string, id: number): void {
    this.answers[1][id] = event
  }

  writeAnswer(event: string, id: number): void {
    this.answers[0][id] = event
  }
}
