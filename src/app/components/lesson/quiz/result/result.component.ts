import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
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
  public ProgressSpinner: ProgressSpinner

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { scores: number[] },
    public progressBarService: ProgressBarService,
  ) {
    this.ProgressSpinner = new ProgressSpinner(
      'quiz',
      data.scores.length,
      data.scores.filter((score) => score >= 0.7).length,
      'determinate',
    )
  }
}
