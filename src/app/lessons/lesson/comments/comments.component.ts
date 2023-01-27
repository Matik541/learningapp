import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService } from 'src/app/lessons.service';
import { UsersService } from 'src/app/users.service';
import { User, Comment } from 'src/environments/environment';

@Component({
	selector: 'lesson-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
	id: number = 0;
	private sub: any;
	private lec: any;

	comments: Comment[] = [];
	logged: User = {} as User;

	newComment: FormControl = new FormControl();

	constructor(
		private activeRoute: ActivatedRoute,
		private usersService: UsersService,
		private lessonsService: LessonsService
	) {
		this.logged = this.usersService.loggedUser;
		this.sub = this.activeRoute.params.subscribe((params) => {
			this.id = +params['id'];
		});
		this.lec = this.lessonsService.getLesson(this.id).subscribe((data) => {
			if (data != null) {
				this.comments = data.comments;
				console.log(this.comments);
				console.log(this.comments[0].id);
				console.log(this.comments[0].comment);
			}
		});
	}

	ngOnInit(): void {}

	ngOnDestroy() {
		this.sub.unsubscribe();
		this.lec.unsubscribe();
	}

	addComment(): void {
		console.log(this.newComment);
		this.lessonsService.addComment(this.id, this.newComment.value).subscribe((data) => {
			console.log(data);
			// this.comments.push(data);
		});
	}

	saveComment(id: number, event: any): void {
		console.log(event, this.comments);
	}
}
