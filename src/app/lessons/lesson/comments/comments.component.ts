import { Component, Input, OnInit } from '@angular/core'
import { Lesson } from 'src/environments/environment'

@Component({
  selector: 'lesson-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  constructor() {}

  ngOnInit(): void {}
}
