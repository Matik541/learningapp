import { COMMA, ENTER } from '@angular/cdk/keycodes'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent,
  MatLegacyAutocomplete as MatAutocomplete,
} from '@angular/material/legacy-autocomplete'
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips'
import { MatLegacyFormFieldAppearance as MatFormFieldAppearance } from '@angular/material/legacy-form-field'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { LessonsService } from 'src/app/lessons.service'
import { Tag } from 'src/environments/environment'

@Component({
  selector: 'autocomplete-tags',
  templateUrl: './autocomplete-tags.component.html',
  styleUrls: ['./autocomplete-tags.component.scss'],
})
export class AutocompleteTagsComponent {
  @Input() appearance: MatFormFieldAppearance
  @Input() match: boolean = false

  @Output() tagsChange = new EventEmitter<Tag[]>()

  visible = true
  selectable = true
  removable = true
  addOnBlur = true
  separatorKeysCodes: number[] = [ENTER, COMMA]
  tagCtrl = new FormControl()
  filteredTags: Observable<String[]>
  tags: Tag[] = []
  allTags: Tag[] = []

  @ViewChild('tagInput', { static: false })
  tagInput: ElementRef<HTMLInputElement>
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete

  constructor(private lessonsService: LessonsService) {
    this.lessonsService.getTags().subscribe((tags) => {
      this.allTags = tags
      console.log(this.allTags)
    })

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tagName: string | null) =>
        tagName
          ? this._filter(tagName)
          : this.allTags.map((tag) => tag.tagName).slice()
      )
    )
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input
      const value = event.value

      if ((value || '').trim()) {
        if (this.match) {
          if (
            this.allTags.map((tag) => tag.tagName).includes(value) &&
            !this.tags.map((tag) => tag.tagName).includes(value)
          ) {
            this.tags.push(this.allTags.find((tag) => tag.tagName === value)!)
            this.emitTags()
          }
        }
      }
      if (input) input.value = ''

      this.tagCtrl.setValue(null)
    }
  }

  remove(tag: Tag): void {
    let index = this.tags.indexOf(tag)
    if (index >= 0) this.tags.splice(index, 1)
    this.emitTags()
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue

    if (this.match) {
      if (
        this.allTags.map((tag) => tag.tagName).includes(value) &&
        !this.tags.map((tag) => tag.tagName).includes(value)
      ) {
        this.tags.push(this.allTags.find((tag) => tag.tagName === value)!)
        this.emitTags()
      }
    }

    this.tagCtrl.setValue(null)
  }

  emitTags() {
    this.tagsChange.emit(this.tags)
  }

  private _filter(value: string): String[] {
    const filterValue = value.toLowerCase()

    return this.allTags
      .map((tag) => tag.tagName)
      .filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0)
  }
}
