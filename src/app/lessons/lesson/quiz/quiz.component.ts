import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Flashcard, Lesson } from 'src/environments/environment'
@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  @Input() quizQuestions: any[][] = []

  answers: any[][] = [[], [], []]

  constructor() {}

  ngOnInit(): void {}

  submit(): void {
    let correctAnswers: {
      question: string
      answer: string
      correctAnswer: string
    }[][] = [[], [], []]
    let correct: number = 0

    // writing
    this.quizQuestions[0].forEach((question, index) => {
      let flashcard = this.lesson.flashcards.find(
        (card) => card.question === question
      )
      if (flashcard) {
        if (flashcard.answer === this.answers[0][index]) correct++
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

        correctAnswers[2].push({
          question: question.question,
          answer: this.answers[2][index],
          correctAnswer: flashcard.answer,
        })
      }
    })

    console.log('correct: ' + correct)
    console.log(correctAnswers)
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
