import { Flashcard, User } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users.service';

type Category = 'flashcards' | 'learn' | 'quiz' | 'comments';
@Component({
	selector: 'app-lesson',
	templateUrl: './lesson.component.html',
	styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy {
	id: number = 0;
	category: Category = 'flashcards';
	private sub: any;

	logged: User = this.usersService.loggedUser;

	write: string[] = [];
	match: { question: string; answers: string[] }[] = [];
	choose: Flashcard[] = [];

	message: string;
	displayMessage: boolean = false;

	constructor(
		private activeRoute: ActivatedRoute,
		private route: Router,
		private usersService: UsersService
	) {
		this.logged = this.usersService.loggedUser;
		this.sub = this.activeRoute.params.subscribe((params) => {
			this.id = +params['id'];
			if (params['category'].match(/flashcards|learn|quiz|comments/) !== null)
				this.category = params['category'];
			else this.route.navigate(['lesson', this.id, 'flashcards']);
		});
	}

	ngOnInit(): void {}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
