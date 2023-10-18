import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/enums/enums'

@Component({
  selector: 'lesson-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  
  @Input() comments: Comment[] | undefined;

    constructor(
    ) { 

    }
}
