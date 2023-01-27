import { LessonsService } from 'src/app/lessons.service';
import { Comment } from 'src/environments/environment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'comment-cards',
	templateUrl: './cards.component.html',
	styleUrls: ['./cards.component.scss'],
})
export class CommentsCardsComponent implements OnInit {
	@Input() input: Comment = {} as Comment;
	@Input() id: number = 0;
	@Input() editable: boolean = false;

	@Output() output: EventEmitter<Comment> = new EventEmitter<Comment>();

	validComment = new FormGroup({
		comment: new FormControl(this.input.comment, [Validators.required]),
	});

	constructor(private LessonsService: LessonsService) {}

	ngOnInit(): void {
		this.validComment.setValue({
			comment: this.input.comment,
		});
	}

	editComment(intent: 'edit' | 'save' | 'cancel' | 'delete'): void {
		let buttons = {
			edit: document.querySelectorAll('.comment-card > .action > .edit')[this.id],
			save: document.querySelectorAll('.comment-card > .action > .save')[this.id],
		};
		let commentCard = document.querySelectorAll('mat-card-content > .content')[this.id];
		let editForm = document.querySelectorAll('mat-card-content > .editForm')[this.id];

		if (intent == 'delete') {
			this.LessonsService.deleteComment(this.input.id).subscribe((data) => {
				console.log(data);
			});
			return;
		}

		if (intent == 'edit') {
			console.log('edit', buttons.edit);
			buttons.edit?.classList.add('hide');
			commentCard?.classList.add('hide');
			editForm?.classList.remove('hide');
			buttons.save?.classList.remove('hide');
		} else {
			if (intent == 'cancel') {
				buttons.save?.classList.add('hide');
				editForm?.classList.add('hide');
				buttons.edit?.classList.remove('hide');
				commentCard?.classList.remove('hide');
				this.validComment.setValue({
					comment: this.input.comment,
				});
			}
			if (
				this.validComment.value.comment != undefined &&
				this.validComment.value.comment != null &&
				this.validComment.value.comment != '' &&
				intent == 'save'
			) {
				buttons.save?.classList.add('hide');
				editForm?.classList.add('hide');
				buttons.edit?.classList.remove('hide');
				commentCard?.classList.remove('hide');
				this.input.comment = this.validComment.value.comment as string;
			}
			this.output.emit(this.input);
		}
	}

	reportComment(): void {
		this.LessonsService.reportComment(this.input.id);
	}
}
