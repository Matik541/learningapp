import { Component, Input, OnInit } from '@angular/core'
import { Lesson } from 'src/environments/environment'

@Component({
  selector: 'lesson-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  constructor() {}

  ngOnInit(): void {}
}
