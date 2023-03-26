import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonsService } from 'src/app/lessons.service';
import { ProgressBarService } from 'src/app/navbar/progress-bar.service';
import { Flashcard, Lesson } from 'src/environments/environment';
import { I } from '@angular/cdk/keycodes';

enum FlashcardStatus {
  NotLearned = 0,
  Learning = 1,
  Learned = 2,
}

type LearnFlashcard = {
  question: string;
  answer: string;
  status: FlashcardStatus;
  type: 'question' | 'answer';
};

@Component({
  selector: 'lesson-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {
  id: number = 0;
  answer: string = '';
  letters: string[] = [];
  hint: string = '';
  repeat: boolean = true;

  private sub: any;
  flashcards: {
    question: string;
    answer: string;
    status: FlashcardStatus;
    type: 'question' | 'answer';
  }[] = [];

  currentQuesion: string = '';
  currentAnswer: string = '';
  currentType: 'question' | 'answer' = 'question';
  currentMethod: string = 'Write';

  selectMode = new FormControl([], Validators.required);
  activeModes: string[] = [];

  answers: string[] = [];

  DOM = {
    btn: document.querySelector('#checkBtn') as HTMLElement,
    card: document.querySelector('.flashcard') as HTMLElement,
    hint: document.querySelector('.hint') as HTMLElement,
    input: document.querySelector('#answer') as HTMLInputElement,
  };

  round = {
    current: 0,
    incorrect: 0,
    size: 10,
    // size: 3,

    flashcardsInRound: [] as LearnFlashcard[],

    pickQuestion: () => {
      this.repeat = true;
      let card = this.round.flashcardsInRound[this.round.current++];
      if (!card) {
        this.snackBar.open(
          `You have finished this round. You got ${
            this.round.size - this.round.incorrect
          } out of ${this.round.size} correct.`,
          'OK',
          {
            duration: 5000,
          }
        );
        this.round.generateRound();
        this.round.pickQuestion();
        return;
      }

      let method = this.selectMode.value?.sort(() => Math.random() - 0.5)[0];

      if (method) {
        this.currentMethod = method;
      } else {
        this.currentMethod = 'Write';
      }

      if (this.currentMethod === 'Write') {
        this.DOM.input.value = '';
        this.DOM.input.focus();
      }
      if (this.currentMethod === 'Select') {
        if (this.currentType == 'question')
          this.answers = [
            card.answer,
            ...this.flashcards
              .map((flashcard) => flashcard.answer)
              .sort(() => Math.random() - 0.5),
          ];
        else
          this.answers = [
            card.question,
            ...this.flashcards
              .map((flashcard) => flashcard.question)
              .sort(() => Math.random() - 0.5),
          ];

        this.answers = this.answers.slice(0, 4).sort(() => Math.random() - 0.5);
      }
      if (this.currentMethod === 'TrueFalse') {
        this.answers = ['True', 'False'];
      }

      if (Math.random() > 0.5) {
        this.currentQuesion = card.question;
        this.currentType = 'answer';
      } else {
        this.currentQuesion = card.answer;
        this.currentType = 'question';
      }
    },
    generateRound: () => {
      this.round.flashcardsInRound = this.flashcards
        .filter((flashcard) => flashcard.status !== FlashcardStatus.Learned)
        .sort(() => Math.random() - 0.5);
      this.round.flashcardsInRound.length = this.round.size;
      this.round.current = 0;
      this.round.incorrect = 0;

      this.progressBar.value = 0;

      this.currentAnswer = '';
      this.hint = '';
    },
  };

  constructor(
    public progressBar: ProgressBarService,
    private lessonsService: LessonsService,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.sub = this.activeRoute.params.subscribe((params) => {
      this.id = +params['id'];
    });
  }

  async ngOnInit() {
    this.sub = this.lessonsService.getLesson(this.id).subscribe((data) => {
      if (data != null) {
        this.flashcards = data.flashcards.map((flashcard) => ({
          ...flashcard,
          status: FlashcardStatus.NotLearned,
          type: 'question',
        }));

        let letters = new Set<string>(
          this.flashcards
            .map((flashcard) => [
              ...flashcard.answer.split(''),
              ...flashcard.question.split(''),
            ])
            .flat()
        );

        this.letters = Array.from(letters).sort();
        this.letters = this.letters.filter(
          (letter) => !' 0123456789abcdefghijklmnopqrstuvwxyz'.includes(letter)
        );
      }

      this.progressBar.mode = 'determinate';
      this.progressBar.value = 0;
      this.progressBar.hidden = false;

      this.DOM.btn = document.querySelector('#checkBtn') as HTMLElement;
      this.DOM.card = document.querySelector('.flashcard') as HTMLElement;
      this.DOM.hint = document.querySelector('.hint') as HTMLElement;
      this.DOM.input = document.querySelector('#answer') as HTMLInputElement;

      this.selectMode.valueChanges.subscribe((value) => {
        console.log(value);
        this.round.generateRound();
        this.round.pickQuestion();
      });

      this.round.generateRound();
      this.round.pickQuestion();
    });
  }

  checkAnswer(): void {
    let answers = this.flashcards
      .map((flashcard) => {
        if (
          this.currentType === 'question' &&
          flashcard.question == this.currentQuesion
        )
          return flashcard.answer;
        if (
          this.currentType === 'answer' &&
          flashcard.answer == this.currentQuesion
        )
          return flashcard.question;
        return null;
      })
      .filter((answer) => answer != null) as string[];

    this.DOM.card?.addEventListener('animationend', () => {
      this.DOM.card?.setAttribute('style', 'animation: none');
      this.DOM.btn?.removeAttribute('disabled');
    });

    let result = this.percentWordMatch(answers, this.answer);

    console.log(this.answer);
    console.log(answers);
    console.log(result);

    if (result == 1) {
      this.repeat = false;
      this.cardCorrectAnimation();
      this.progressBar.value = (this.round.current / this.round.size) * 100;
      return;
    } else if (result > 0.8) {
      this.repeat = true;
      this.cardAlmostCorrectAnimation();
      return;
    } else {
      this.repeat = true;
      this.cardIncorrectAnimation();
    }

    if (this.repeat) {
      this.repeat = false;
      this.round.incorrect++;
    }
  }

  cardCorrectAnimation() {
    this.DOM.card?.classList.add('correct');
    this.DOM.btn?.setAttribute('disabled', '');
    setTimeout(() => {
      this.DOM.card?.setAttribute(
        'style',
        `animation: slide-right 0.25s ease-in-out 1`
      );
      this.DOM.card?.addEventListener('animationend', () =>
        this.DOM.card?.setAttribute('style', 'animation: none')
      );
      setTimeout(() => {
        this.DOM.card?.classList.remove('correct');

        this.round.pickQuestion();
        this.currentAnswer = '';

        this.answer = '';
        this.hint = '';
        this.DOM.input?.focus();
      }, 125);
    }, 500);
  }

  cardAlmostCorrectAnimation() {
    this.DOM.btn?.setAttribute('disabled', '');
    setTimeout(() => {
      this.DOM.card?.setAttribute(
        'style',
        `animation: slide-right 0.25s ease-in-out 1`
      );
      setTimeout(() => {
        this.answer = '';
        this.hint = '';
        this.DOM.input?.focus();
      }, 125);
    }, 500);
  }

  cardIncorrectAnimation() {
    this.DOM.card?.classList.add('incorrect');
    this.DOM.card?.setAttribute('style', `animation: shake 0.5s ease-in-out 1`);
    this.DOM.hint?.classList.remove('hide');

    setTimeout(() => {
      this.DOM.card?.classList.remove('correct', 'incorrect');

      this.answer = '';
      this.hint = '';
      this.DOM.input?.focus();
    }, 500);
  }

  showHint() {
    this.hint = this.flashcards
      .map((flashcard) => {
        if (
          this.currentType === 'question' &&
          flashcard.question == this.currentQuesion
        )
          return flashcard.answer;
        if (
          this.currentType === 'answer' &&
          flashcard.answer == this.currentQuesion
        )
          return flashcard.question;
        return null;
      })
      .filter((answer) => answer != null)
      .join(', ');
  }

  percentWordMatch(answers: string[], answer: string): number {
    let max = 0;
    let best = '';
    let word = '';
    answers.forEach((ans) => {
      let match = 0;
      word = '';
      for (let i = 0; i < ans.length; i++) {
        if (ans[i] === answer[i]) {
          match++;
          word += `<span class="correct">${answer[i]}</span>`;
        } else {
          word += `<strong class="incorrect">${answer[i] ?? ans[i]}</strong>`;
        }
      }
      if (match / ans.length > max) {
        best = word;
        max = match / ans.length;
      }
    });
    let score = Math.round(max * 100) / 100;
    if (score > 0.8) this.currentAnswer = best;
    return score;
  }

  addLetter(letter: string, event: Event) {
    this.answer =
      this.answer.slice(0, this.DOM.input.selectionStart ?? 0) +
      letter +
      this.answer.slice(this.DOM.input.selectionStart ?? 0);
    this.DOM.input.focus();
  }

  ngOnDestroy(): void {
    this.progressBar.hidden = true;
    this.sub.unsubscribe();
  }
}
