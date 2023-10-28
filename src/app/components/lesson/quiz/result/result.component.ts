import { Flashcard, PractiseFlashcard } from 'src/app/enums/enums';
import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Methods } from 'src/app/enums/enums'
import {
  ProgressSpinner,
  ProgressBarService,
} from 'src/app/services/progress-bar.service'

@Component({
  selector: 'lesson-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {

  public progressSpinner: ProgressSpinner

  correct: number[]
  incorrect: number[]

  score: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { scores: number[], size: number, methods: [Methods, PractiseFlashcard[]][] },
    public progressBarService: ProgressBarService,
  ) {
    this.progressSpinner = new ProgressSpinner(
      'quiz',
      data.scores.length,
      0,
      'determinate',
    )
    this.progressSpinner.current = data.scores.filter((score) => score >= 0.7).length

    this.correct = data.scores.filter((score) => score >= 0.7)
    this.incorrect = data.scores.filter((score) => score < 0.7) 

    this.score = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length * 10000) / 100;
  }
}
