import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from 'src/app/components/auth/users.service';
import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentLesson, CommentUser } from 'src/app/enums/enums';
import { CommentsService } from 'src/app/components/lesson/comments/comments.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'lesson-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  @Input() comments: CommentUser[] | undefined;
  @Input() lessonId: number | undefined;

  lowBound: number = 0;
  highBound: number = 20;

  commentCtrl = new FormControl('', [
    Validators.required,
    (): ValidationErrors | null => {
      if (!this.usersService.user) {
        return { notLoggedIn: true };
      }
      return null;
    },
  ]);

  constructor(
    public usersService: UsersService,
    private commentsService: CommentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowBound = event.pageIndex * event.pageSize;
    this.highBound = this.lowBound + event.pageSize;
    return event;
  }

  public send() {
    if (
      !this.commentCtrl.valid ||
      !this.usersService.user ||
      !this.commentCtrl.value
    ) {
      this.snackBar.open('Comment cannot be added', 'Close', {
        duration: 2000,
      });
      return;
    }

    let newComment: CommentLesson = {} as CommentLesson;
    this.commentsService
      .addComment(this.commentCtrl.value, this.lessonId ?? -1)
      .subscribe((comment) => {
        newComment.comment = comment.comment;
        newComment.id = comment.id;
      });

    this.comments?.push({
      id: newComment.id,
      comment: this.commentCtrl.value,
      creator: this.usersService.user,
    });

    this.commentCtrl.setValue('');
  }

  public remove(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Comment',
        content: 'Are you sure you want to delete this comment?',
        confirm: {
          text: 'Delete',
          color: 'warn',
          type: 'raised',
        },
        cancel: {
          text: 'Cancel',
          color: 'primary',
          type: 'flat',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentsService.deleteComment(id).subscribe();
        this.comments = this.comments?.filter((comment) => comment.id != id);
      }
    });
  }

  public edit(Comment: CommentUser) {}

  private update(comment: CommentUser) {}
}
