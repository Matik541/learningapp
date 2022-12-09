import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/lessons.service';
import { UsersService } from 'src/app/users.service';
import { Flashcard, Lesson, User } from 'src/environments/environment';

@Component({
	selector: 'lesson-flashcards',
	templateUrl: './flashcards.component.html',
	styleUrls: ['./flashcards.component.scss'],
})
export class FlashcardsComponent implements OnInit {
	@Input() lesson: Lesson | undefined = {} as Lesson;

	logged: User = {} as User;

	flashcard: Flashcard = {} as Flashcard;
	indexFleshcard: number = 0;

	edited: boolean = false;

	constructor(
		private usersService: UsersService,
		private route: Router,
		private lessonsService: LessonsService
	) {
		this.logged = this.usersService.loggedUser;
	}

	ngOnInit(): void {
		setTimeout(() => {
			if (this.lesson)
				if (this.lesson.flashcards?.length > 0) this.flashcard = this.lesson.flashcards[0];
		}, 1);
	}

	flipFlashcard(): void {
		let card = document.querySelector('.flashcard');
		let front = document.querySelector('.front');
		let back = document.querySelector('.back');
		card?.setAttribute('style', 'animation: none');
		card?.setAttribute('style', 'animation: flip 0.5s 1');

		card?.addEventListener('animationend', () => card?.setAttribute('style', 'animation: none'));

		setTimeout(() => {
			front?.classList.toggle('hidden');
			back?.classList.toggle('hidden');
		}, 250);
	}

	changeFlashcard(by: -1 | 1): void {
		let card = document.querySelector('.flashcard');

		card?.setAttribute('style', 'animation: none');
		card?.setAttribute(
			'style',
			`animation: slide-${by == -1 ? 'left' : 'right'} 0.25s ease-in-out 1 `
		);

		card?.addEventListener('animationend', () => card?.setAttribute('style', 'animation: none'));

		setTimeout(() => {
			document.querySelector('.front')?.classList.remove('hidden');
			document.querySelector('.back')?.classList.add('hidden');
			if (this.lesson) {
				this.indexFleshcard += by;
				if (this.indexFleshcard >= 0 && this.indexFleshcard < this.lesson.flashcards.length) {
					this.flashcard = this.lesson.flashcards[this.indexFleshcard];
				}
			}
		}, 125);
	}
	saveFlashcard(id: number, event: any): void {
		console.log(event, this.lesson);
		if (this.lesson) {
			this.lesson.flashcards[id] = event;
			this.edited = true;
		}
	}

	deleteLesson() {
		if (this.lesson)
			this.lessonsService.delete(this.lesson.id).subscribe(() => {
				console.log(this.lesson);
			});
		// this.route.navigate(['/lessons']);
	}

	refreshLesson() {
		// refresh this component
		this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			if (this.lesson) this.route.navigate(['/lessons', this.lesson.id]);
		});
	}

	updateLesson() {
		console.log(this.lesson, this.lesson?.id);
		if (this.lesson)
			this.lessonsService.update(this.lesson.id, this.lesson).subscribe(() => {
				if (this.edited) this.refreshLesson();
			});
	}
}
