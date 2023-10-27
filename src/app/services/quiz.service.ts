import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public start?: Date = undefined;
  
  constructor() { }

  startQuiz() {
    this.start = new Date();
  }

  finishQuiz() {
    console.log('score calc')
    this.start = undefined;
  }
}
