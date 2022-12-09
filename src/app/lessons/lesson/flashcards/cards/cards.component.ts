import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Flashcard } from 'src/environments/environment';

@Component({
	selector: 'lesson-cards',
	templateUrl: './cards.component.html',
	styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
	@Input() input: Flashcard = {} as Flashcard;
	@Input() id: number = 0;
	@Input() editable: boolean = false;

	@Output() output: EventEmitter<Flashcard> = new EventEmitter<Flashcard>();

	validFlashcard = new FormGroup({
		question: new FormControl(this.input.question, [Validators.required]),
		answer: new FormControl(this.input.answer, [Validators.required]),
	});

	ngOnInit(): void {
		this.validFlashcard.setValue({
			question: this.input.question,
			answer: this.input.answer,
		});
	}

	editFlashcard(intent: 'edit' | 'save' | 'cancel'): void {
		let buttons = {
			edit: document.querySelectorAll('mat-card-content > .action > .edit')[this.id],
			save: document.querySelectorAll('mat-card-content > .action > .save')[this.id],
			// cancel: document.querySelectorAll('mat-card-content > .action > .cancel')[id],
		};
		let flashcard = document.querySelectorAll('mat-card-content > .content')[this.id];
		let editForm = document.querySelectorAll('mat-card-content > .editForm')[this.id];

		if (intent == 'edit') {
			buttons.edit?.classList.add('hide');
			flashcard?.classList.add('hide');
			editForm?.classList.remove('hide');
			buttons.save?.classList.remove('hide');
		} else {
			if (intent == 'cancel') {
				buttons.save?.classList.add('hide');
				editForm?.classList.add('hide');
				buttons.edit?.classList.remove('hide');
				flashcard?.classList.remove('hide');
				this.validFlashcard.setValue({
					question: this.input.question,
					answer: this.input.answer,
				});
			}
			if (
				this.validFlashcard.value.question != undefined &&
				this.validFlashcard.value.answer != undefined &&
				this.validFlashcard.value.question != null &&
				this.validFlashcard.value.answer != null &&
				this.validFlashcard.value.question != '' &&
				this.validFlashcard.value.answer != '' &&
				intent == 'save'
			) {
				buttons.save?.classList.add('hide');
				editForm?.classList.add('hide');
				buttons.edit?.classList.remove('hide');
				flashcard?.classList.remove('hide');
				this.input.question = this.validFlashcard.value.question as string;
				this.input.answer = this.validFlashcard.value.answer as string;
			}
			this.output.emit(this.input);
		}
	}
}
