import { MatSnackBar } from '@angular/material/snack-bar'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LessonsService } from 'src/app/lessons.service'
import { ProgressBarService } from 'src/app/navbar/progress-bar.service'
import { Flashcard, Lesson } from 'src/environments/environment'

type Round = {
  roundProgress: number
  curentRound: number
  size: number
  incorrect: number
  flashcardsInRound: ({
    flashcard: number
    type: number
    status: string
  } | null)[]
  generateRound: () => void
  pickQuestion: () => Flashcard
}

// TODO: impruve the round system, add other types of rounds, add sorting by status
@Component({
  selector: 'lesson-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {
  id: number = 0
  indexFleshcard: number = 0
  answer: string = ''

  private sub: any
  flashcards: {
    flashcard: Flashcard
    answer: string
    status: number
  }[] = []

  currentQuesion: string = ''
  currentAnswer: string = ''

  round: Round = {
    roundProgress: 0,
    curentRound: 0,
    size: 10,
    incorrect: 0,
    flashcardsInRound: [
      {
        flashcard: 0,
        type: 0,
        status: 'correct' as 'correct' | 'incorrect',
      },
    ],
    generateRound: () => {
      this.round.curentRound++
      this.round.flashcardsInRound = this.flashcards
        .map((flashcard, index) => {
          if (flashcard.status == 3) return null
          return {
            flashcard: index,
            type: flashcard.status,
            status: 'incorrect',
          }
        })
        .filter((flashcard) => flashcard != null)
        .splice(0, this.round.size)
        .sort(() => Math.random() - 0.5)
      this.round.roundProgress = 0
      this.round.incorrect = 0
      this.round.size =
        this.round.flashcardsInRound.length < 10
          ? this.round.flashcardsInRound.length
          : 10
    },
    pickQuestion: () => {
      let question = this.round.flashcardsInRound[this.round.roundProgress]
      if (question == null) return { question: '', answer: '' }

      if (Math.random() > 0.5)
        return this.flashcards[question.flashcard].flashcard
      return {
        question: this.flashcards[question.flashcard].flashcard.answer,
        answer: this.flashcards[question.flashcard].flashcard.question,
      }
    },
  }

  select = new FormControl(['0'], [Validators.required])

  constructor(
    public progressBar: ProgressBarService,
    private lessonsService: LessonsService,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.sub = this.activeRoute.params.subscribe((params) => {
      this.id = +params['id']
    })
  }

  ngOnInit(): void {
    this.sub = this.lessonsService.getLesson(this.id).subscribe((data) => {
      if (data != null)
        this.flashcards = data.flashcards
          .map((flashcard) => {
            return {
              flashcard,
              answer: '',
              status: 0,
            }
          })
          .sort(() => Math.random() - 0.5)
      console.log(this.flashcards)
    })

    this.progressBar.mode = 'determinate'
    this.progressBar.value = 0
    this.progressBar.hidden = false

    setTimeout(() => {
      this.round.generateRound()
      let flashcard = this.round.pickQuestion()
      console.log(flashcard, this.round)
      this.currentQuesion = flashcard.question
      this.currentAnswer = flashcard.answer
    }, 100)
  }

  check(): void {
    let card = document.querySelector('.flashcard')
    let btn = document.querySelector('.flashcard button')

    card?.classList.remove('correct', 'incorrect')
    if (this.currentAnswer === this.answer) {
      this.round.roundProgress++
      this.progressBar.value =
        (this.round.roundProgress / this.round.size) * 100

      if (this.round.roundProgress == this.round.size) {
        this.snackBar.open(
          'Round completed successfully, mistakes: ' + this.round.incorrect
        )
        this.round.generateRound()
        this.progressBar.value = 0
      }

      card?.classList.add('correct')
      btn?.setAttribute('disabled', '')

      setTimeout(() => {
        card?.setAttribute('style', 'animation: none')
        card?.setAttribute(
          'style',
          `animation: slide-right 0.25s ease-in-out 1`
        )

        card?.addEventListener('animationend', () =>
          card?.setAttribute('style', 'animation: none')
        )

        setTimeout(() => {
          let flashcard = this.round.pickQuestion()
          this.currentQuesion = flashcard.question
          this.currentAnswer = flashcard.answer
          card?.classList.remove('correct', 'incorrect')
          this.answer = ''
        }, 125)
      }, 500)
    } else {
      this.round.incorrect++
      card?.classList.add('incorrect')
      card?.setAttribute('style', `animation: shake 0.5s ease-in-out 1`)
    }
    card?.addEventListener('animationend', () => {
      card?.setAttribute('style', 'animation: none')
      btn?.removeAttribute('disabled')
    })
  }

  ngOnDestroy(): void {
    this.progressBar.hidden = true
    this.sub.unsubscribe()
  }
}
