import { Component, Input, OnInit } from '@angular/core'
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
  private lec: any
  flashcards: {
    flashcard: Flashcard
    status: 0 | 1 | 2
  }[]
  @Input() lesson: Lesson = {} as Lesson
  constructor(
    public progressBar: ProgressBarService,
    private lessonsService: LessonsService
  ) {}

  ngOnInit(): void {
    this.lec = this.lessonsService.getLesson(this.id).subscribe((data) => {
      this.flashcards = data.flashcards.map((flashcard) => {
        return {
          flashcard,
          status: 0,
        }
      })
    })

    console.log(this.flashcards)

    this.progressBar.mode = 'determinate'
    this.progressBar.value = 0
    this.progressBar.hidden = false
  }

  ngOnDestroy(): void {
    this.progressBar.hidden = true
    this.lec.unsubscribe()
  }
}
