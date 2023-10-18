import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { PractiseFlashcard } from 'src/app/enums/enums'

@Component({
  selector: 'methods-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements AfterViewInit {
  @Input() flashcard: PractiseFlashcard | undefined

  @Output() answer = new EventEmitter<string | null>()

  @ViewChild('answer') input: ElementRef<HTMLInputElement> | undefined

  answerValue: string = ''

  constructor() {}

  onAnswerChange(answer: string) {
    console.log('xdxd', answer)
    this.answerValue = answer
    this.answer.emit(answer)
  }

  ngAfterViewInit() {
    console.log('this.input', this.input)
    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus()
        this.input.nativeElement.select()
      }
    }, 0)
  }
}
