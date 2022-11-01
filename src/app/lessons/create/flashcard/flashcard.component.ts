import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'add-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent implements OnInit {
  @Input() id: number = 0

  @Output() exportForm = new EventEmitter()

  public panelOpenState: boolean = false

  public flashcardFromGroup: FormGroup = this._formBuilder.group({
    que: new FormControl('', [Validators.required]),
    anw: new FormControl('', [Validators.required]),
  })

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {}

  public check(): void {
    if (this.flashcardFromGroup.valid) {
      this.exportForm.emit({
        id: this.id,
        flashcard: {
          world: this.flashcardFromGroup.value.que,
          translation: this.flashcardFromGroup.value.anw,
        },
      })
    }
  }
}
