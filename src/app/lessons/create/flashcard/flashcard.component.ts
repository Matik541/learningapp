import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Flashcard } from 'src/environments/environment'

@Component({
  selector: 'add-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent implements OnInit {
  @Input() input: Flashcard = {} as Flashcard
  @Input() index: number

  @Output() push: EventEmitter<Flashcard> = new EventEmitter()
  @Output() slice: EventEmitter<Flashcard> = new EventEmitter()

  saved = false

  constructor(private _formBuilder: FormBuilder) {}

  validFlashcard = new FormGroup({
    question: new FormControl(this.input.question, [Validators.required]),
    answer: new FormControl(this.input.answer, [Validators.required]),
  })

  ngOnInit(): void {
    this.validFlashcard.setValue({
      question: this.input.question,
      answer: this.input.answer,
    })
    if (this.input.answer && this.input.question) this.saved = true
  }

  save() {}
  remove() {
    this.slice.emit({
      question: this.input.question,
      answer: this.input.answer,
    })
  }

  editFlashcard(intent: 'save' | 'remove'): void {
    if (intent == 'remove') {
      this.slice.emit()
      return
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
      this.input.question = this.validFlashcard.value.question as string
      this.input.answer = this.validFlashcard.value.answer as string
    }
    this.saved = true
    this.input.answer = this.validFlashcard.value.answer ?? this.input.answer
    this.input.question =
      this.validFlashcard.value.question ?? this.input.question

    this.push.emit({
      question: this.input.question,
      answer: this.input.answer,
    })
  }
}
