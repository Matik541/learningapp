import { Lesson, Methods, PractiseFlashcard } from 'src/app/enums/enums'
import { Component, Input } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ProgressBarService } from 'src/app/services/progress-bar.service'

@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent {
  @Input() lesson: Lesson | undefined = {} as Lesson

  started: Date | undefined = undefined

  avableMethods: Methods[] = [
    Methods.BOOLEAN,
    Methods.MULTIPLE,
    Methods.WRITE,
    /* Methods.MATCH */
  ]
  methods: { method: Methods; name: string }[] = [
    { method: Methods.BOOLEAN, name: 'boolean' },
    { method: Methods.MULTIPLE, name: 'multiple' },
    { method: Methods.MATCH, name: 'match' },
    { method: Methods.WRITE, name: 'write' },
  ]

  sizes: number[] = [3, 5, 8, 10]

  quiz: {
    size: number
    methods: [Methods, PractiseFlashcard[]][]
    answers: (string | null)[]
  } = {
    size: this.sizes[1],
    methods: [
      [Methods.BOOLEAN, []],
      [Methods.MULTIPLE, []],
      [Methods.MATCH, []],
      [Methods.WRITE, []],
    ],
    answers: [],
  }

  private variant: ('question' | 'answer')[] = ['question', 'answer']

  constructor(
    private snackBar: MatSnackBar,
    private progressBarService: ProgressBarService,
  ) {}

  generateQuiz() {
    this.started = new Date()

    let navBar = this.progressBarService.getBar('navigation')
    if (navBar)
      navBar.max = this.quiz.size * this.quiz.methods.length

    setTimeout(() => {
      let el = document.querySelector('.quiz') as HTMLElement
      if (el) el.scrollTop = 0
    }, 50)

    this.quiz = {
      size: this.quiz.size,
      methods: [
        [Methods.BOOLEAN, []],
        [Methods.MULTIPLE, []],
        [Methods.MATCH, []],
        [Methods.WRITE, []],
      ],
      answers: [],
    }
    if (!this.lesson?.flashcards) return

    let flashcards: PractiseFlashcard[] = []
    let avableFlashcards =
      [...this.lesson.flashcards].sort(() => Math.random() - 0.5) ?? []

    for (let i = 0; i < this.quiz.size; i++) {
      let flashcard: PractiseFlashcard = {} as PractiseFlashcard

      // case Methods.BOOLEAN:
      avableFlashcards.sort(() => Math.random() - 0.5)
      this.variant.sort(() => Math.random() - 0.5)

      let answers = avableFlashcards.filter(
        (flashcard) =>
          flashcard.answer !== avableFlashcards[i][this.variant[0]],
      )
      flashcard = {
        method: Methods.BOOLEAN,
        variant: this.variant,
        question: avableFlashcards[i][this.variant[0]],
        answer:
          Math.random() > 0.5
            ? avableFlashcards[i][this.variant[1]]
            : answers[Math.floor(Math.random() * answers.length)][
                this.variant[1]
              ],
      }
      this.quiz.methods[0][1].push(flashcard)

      // case Methods.MULTIPLE:
      avableFlashcards.sort(() => Math.random() - 0.5)
      this.variant.sort(() => Math.random() - 0.5)

      flashcard = {
        method: Methods.MULTIPLE,
        variant: this.variant,
        question: avableFlashcards[i][this.variant[0]],
        options: [...avableFlashcards]
          .filter(
            (flashcard) =>
              flashcard[this.variant[1]] !==
              avableFlashcards[i][this.variant[1]],
          )
          .sort(() => Math.random() - 0.5)
          .map((flashcard) => flashcard[this.variant[1]])
          .splice(0, 3),
        answers: [...avableFlashcards]
          .filter(
            (flashcard) =>
              flashcard[this.variant[1]] ===
              avableFlashcards[i][this.variant[1]],
          )
          .map((flashcard) => flashcard[this.variant[1]]),
      }
      this.quiz.methods[1][1].push(flashcard)

      // case Methods.WRITE:
      avableFlashcards.sort(() => Math.random() - 0.5)
      this.variant.sort(() => Math.random() - 0.5)

      flashcard = {
        method: Methods.WRITE,
        variant: this.variant,
        question: avableFlashcards[i][this.variant[0]],
        answers: [...avableFlashcards]
          .filter(
            (flashcard) =>
              flashcard[this.variant[1]] ===
              avableFlashcards[i][this.variant[1]],
          )
          .map((flashcard) => flashcard[this.variant[1]]),
      }
      this.quiz.methods[3][1].push(flashcard)

      // case Methods.MATCH:
      // console.error('Match method not implemented yet')
      // avableFlashcards.sort(() => Math.random() - 0.5)
      // this.variant.sort(() => Math.random() - 0.5)
    }
  }

  changeAnswer(method: number, index: number, answer: string | null) {
    this.quiz.answers[method * this.quiz.size + index] = answer

    let navBar = this.progressBarService.getBar('navigation')
    if (navBar)
      navBar.current = this.quiz.answers.filter((answer) => answer).length

  }

  submitQuiz() {
      if (!this.lesson) return;

      /*
      // case Methods.BOOLEAN:
        let avableFlashcards = [...this.lesson.flashcards]

        console.log(resolveing, this.newAnswer)

        let flashcardExists = avableFlashcards.some((flashcard) => {
          if (
            (flashcard[resolveing.variant[0]] === resolveing.answer &&
              flashcard[resolveing.variant[1]] === resolveing.question) ||
            (flashcard[resolveing.variant[1]] === resolveing.answer &&
              flashcard[resolveing.variant[0]] === resolveing.question)
          ) {
            return true
          }
          return false
        })

        if (
          (flashcardExists && (this.newAnswer === resolveing.answer) || this.newAnswer === resolveing.question) ||
          (!flashcardExists && this.newAnswer === null) 
        )
          score = 1
        break
      // case Methods.MULTIPLE:
        if (this.newAnswer)
          if (resolveing.answers?.includes(this.newAnswer)) score = 1
      // case Methods.MATCH:
      // case Methods.WRITE:
        if (resolveing.answers?.includes(this.newAnswer ?? '')) {
          score = 1
          break
        }

        if (!this.newAnswer) {
          score = 0
        }

        let input = this.newAnswer as string
        let similarityScores: number[] | undefined = resolveing.answers?.map(
          (value) => {
            return (
              1 -
              leven(this.normalizeString(input), this.normalizeString(value)) /
                Math.max(input.length, value.length)
            )
          },
        )

        score = Math.max(...(similarityScores ?? [0]))
    }

    console.log(score, this.answers)

    if (this.answers[this.round.current])
      this.answers[this.round.current] = score
    else this.answers.push(score)

    this.display = false
    this.round.current++
    setTimeout(() => {
      this.display = true
    }, 50)

    let navBar = this.progressBarService.getBar('test')
    if (navBar) {
      navBar.max = this.round.size
      navBar.current = this.round.current
    }

    if (this.round.current >= this.round.size) {
      this.snackBar.open(
        `You scored ${
          this.answers.filter((answer) => answer === 1).length
        } out of ${this.round.size}`,
        'Close',
        {
          duration: 2000,
        },
      )
      this.generateRound()
    }
  */
  }
}
