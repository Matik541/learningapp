import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Flashcard } from 'src/environments/environment'

@Component({
  selector: 'add-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent implements OnInit {
  @Input() que: string = ''
  @Input() ans: string = ''

  @Output() push: EventEmitter<Flashcard> = new EventEmitter()
  @Output() slice: EventEmitter<Flashcard> = new EventEmitter()

  saved = false

  flashcardsForm: FormGroup<{
    question: FormControl<string | null>
    answer: FormControl<string | null>
  }>

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.flashcardsForm = this._formBuilder.group({
      question: new FormControl(this.que, [Validators.required]),
      answer: new FormControl(this.ans, [Validators.required]),
    })
    if (this.ans && this.que) this.saved = true
  }

  save() {
    this.saved = true
    this.ans = this.flashcardsForm.value.answer ?? this.ans
    this.que = this.flashcardsForm.value.question ?? this.que

    this.push.emit({ question: this.que, answer: this.ans })
  }
  remove() {
    this.slice.emit({ question: this.que, answer: this.ans })
  }
}
