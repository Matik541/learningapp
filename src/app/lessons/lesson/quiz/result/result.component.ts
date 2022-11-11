import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'quiz-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  data: any = {
    correct: 0,
    incorrect: 0,
    correctAnswers: [],
  }

  correct: number = 0
  incorrect: number = 0

  constructor(
    public dialogRef: MatDialogRef<ResultComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data
    setTimeout(() => {
      this.correct = (data.correct / data.total) * 100
      this.incorrect = ((data.incorrect + data.correct) / data.total) * 100
    }, 1)
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  close(): void {
    this.dialogRef.close()
  }
}
