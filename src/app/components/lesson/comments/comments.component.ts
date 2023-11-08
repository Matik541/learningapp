import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentUser } from 'src/app/enums/enums';
import { CommentsService } from 'src/app/components/lesson/comments/comments.service';

@Component({
  selector: 'lesson-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  @Input() comments: CommentUser[] | undefined;

  lowBound: number = 0;
  highBound: number = 20;

  comment: string = '';

  constructor(
    private commentsService: CommentsService,
    private snackBar: MatSnackBar
  ) {}

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowBound = event.pageIndex * event.pageSize;
    this.highBound = this.lowBound + event.pageSize;
    return event;
  }

  public send() {
    if (this.comment ?? false) return;
    this.commentsService.addComment(this.comment);
    this.comment = '';
  }
}
