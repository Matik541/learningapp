import { Component, Input, OnInit } from '@angular/core'
import { UsersService } from 'src/app/users.service'
import { Flashcard, Lesson, User } from 'src/environments/environment'

@Component({
  selector: 'lesson-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss'],
})
export class FlashcardsComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson

  logged: User = {} as User

  flashcard: Flashcard = {} as Flashcard
  indexFleshcard: number = 0

  constructor(private usersService: UsersService) {
    this.logged = this.usersService.loggedUser
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.lesson.flashcards?.length > 0)
        this.flashcard = this.lesson.flashcards[0]
    }, 1)
  }

  flipFlashcard(): void {
    let card = document.querySelector('.flashcard')
    let front = document.querySelector('.front')
    let back = document.querySelector('.back')
    card?.setAttribute('style', 'animation: none')
    card?.setAttribute('style', 'animation: flip 0.5s 1')

    card?.addEventListener('animationend', () =>
      card?.setAttribute('style', 'animation: none')
    )

    setTimeout(() => {
      front?.classList.toggle('hidden')
      back?.classList.toggle('hidden')
    }, 250)
  }

  changeFlashcard(by: -1 | 1): void {
    this.indexFleshcard += by
    if (
      this.indexFleshcard >= 0 &&
      this.indexFleshcard < this.lesson.flashcards.length
    ) {
      this.flashcard = this.lesson.flashcards[this.indexFleshcard]
    }
  }

  editFlashcard(id: number): void {
    console.log(id)
  }
}
