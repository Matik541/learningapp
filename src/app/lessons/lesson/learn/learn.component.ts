import { F } from '@angular/cdk/keycodes'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { LessonsService } from 'src/app/lessons.service'
import { ProgressBarService } from 'src/app/navbar/progress-bar.service'
import { Flashcard, Lesson } from 'src/environments/environment'

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
    status: 0 | 1 | 2
  }[] = []

  constructor(
    public progressBar: ProgressBarService,
    private lessonsService: LessonsService,
    private activeRoute: ActivatedRoute
  ) {
    this.sub = this.activeRoute.params.subscribe((params) => {
      this.id = +params['id']
    })
  }

  ngOnInit(): void {
    this.sub = this.lessonsService.getLesson(this.id).subscribe((data) => {
      this.flashcards = data.flashcards
        .map((flashcard) => {
          return {
            flashcard,
            answer: '',
            status: 0 as 0,
          }
        })
        .sort(() => Math.random() - 0.5)
      console.log(this.flashcards)
    })

    this.progressBar.mode = 'determinate'
    this.progressBar.value = 0
    this.progressBar.hidden = false
  }

  check(): void {
    let card = document.querySelector('.flashcard')

    card?.classList.remove('correct', 'incorrect')
    let size = this.flashcards.length
    let index = this.indexFleshcard
    if (this.flashcards[index % size].flashcard.answer === this.answer) {
      this.flashcards[index % size].status++
      this.flashcards[index % size].answer = this.answer
      console.log(this.flashcards[index % size])
      card?.classList.add('correct')

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
          this.indexFleshcard += 1
          card?.classList.remove('correct', 'incorrect')
          this.answer = ''
        }, 125)
      }, 500)
    } else {
      card?.classList.add('incorrect')
      card?.setAttribute('style', `animation: shake 0.5s ease-in-out 1`)
    }
    card?.addEventListener('animationend', () => {
      card?.setAttribute('style', 'animation: none')
    })
  }

  ngOnDestroy(): void {
    this.progressBar.hidden = true
    this.sub.unsubscribe()
  }
}
