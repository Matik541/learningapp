import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lesson } from 'src/app/enums/enums';
import { Methods } from 'src/app/enums/enums';
@Component({
  selector: 'lesson-practise',
  templateUrl: './practise.component.html',
  styleUrls: ['./practise.component.scss']
})
export class PractiseComponent {
  @Input() lesson: Lesson | undefined;

  simpleMode: boolean = false;

  methods: {
    name: string
    value: boolean
  }[] = []
  method: Methods = Methods.BOOLEAN;
  
  constructor(
    private snackBar: MatSnackBar
    
  ) { 
    this.methods[Methods.BOOLEAN] = { name: 'True/False', value: true }
    this.methods[Methods.MATCH] = { name: 'Match', value: false }
    this.methods[Methods.WRITE] = { name: 'Write', value: false }
  }

  changeAnswer(index: number, answer: string) {
    
  }

  confirmAnswer() {
    
  }

  updateMethods() {
    if (this.methods.every(method => method.value === false)) {
      this.snackBar.open('You must select at least one method', 'Close', { duration: 2000 });
      this.methods[Methods.BOOLEAN].value = true;
    }
  }
}
