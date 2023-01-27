import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

type Answers = {
	question: string;
	answer: string;
	correctAnswer: string;
};
type DataType = {
	correct: number;
	incorrect: number;
	total: number;
	allAnswers: Answers[][];
};
@Component({
	selector: 'quiz-result',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
	data: DataType = {
		correct: 0,
		incorrect: 0,
		total: 0,
		allAnswers: [],
	};

	correct: number = 0;
	incorrect: number = 0;
	stroke: number[] = [15, 15, 15];

	allAnswers: Answers[][] = [] as Answers[][];
	correctData: {
		correct: number;
		incorrect: number;
		total: number;
		name: string;
	}[] = [
		{ correct: 0, incorrect: 0, total: 0, name: 'Writing' },
		{ correct: 0, incorrect: 0, total: 0, name: 'Matching' },
		{ correct: 0, incorrect: 0, total: 0, name: 'Choosing' },
	];

	interE: any;
	interL: any;

	constructor(
		public dialogRef: MatDialogRef<ResultComponent>,
		@Inject(MAT_DIALOG_DATA) data: DataType
	) {
		this.data = data;
		console.log(this.data);
		setTimeout(() => {
			this.stroke = [10, 10, 10];

			this.allAnswers = data.allAnswers;

			this.allAnswers.forEach((correctAnswer, index) => {
				this.correctData[index] = {
					correct: correctAnswer.filter((answer) => answer.answer === answer.correctAnswer).length,
					incorrect: correctAnswer.filter((answer) => {
						return (
							(answer.answer != answer.correctAnswer && answer.answer != undefined) ||
							(index === 2 && answer.answer === '')
						);
					}).length,
					total: correctAnswer.length,
					name: ['Writing', 'Matching', 'Choosing'][index],
				};
				this.correct += this.correctData[index].correct;
				this.incorrect += this.correctData[index].incorrect;
			});

			this.data.correct = this.correct;
			this.data.incorrect = this.incorrect;

			this.correct = (this.correct / data.total) * 100;
			this.incorrect = (this.incorrect / data.total) * 100;
		}, 1);
	}

	ngOnInit(): void {}

	close(): void {
		this.dialogRef.close();
	}
}
