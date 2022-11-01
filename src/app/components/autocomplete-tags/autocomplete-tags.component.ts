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
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { MatFormFieldAppearance } from '@angular/material/form-field'
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
  filteredTags: Observable<string[]>
  tags: string[] = []
  //TODO: get tags from database - API CALLs for all tags
  allTags: string[] = []

  @ViewChild('tagInput', { static: false })
  tagInput: ElementRef<HTMLInputElement>
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete

  constructor(private lessonsService: LessonsService) {
    this.lessonsService.getTags().subscribe((tags) => {
      for (let tag of tags) {
        this.allTags[tag.id] = tag.tagName
      }
      console.log(this.allTags)
    })

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    )
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input
      const value = event.value

      if ((value || '').trim()) {
        if (this.match) {
          if (this.allTags.includes(value) && !this.tags.includes(value)) {
            this.tags.push(value.trim())
            let tagIds = this.tags.map((tag) => {
              return { id: this.allTags.indexOf(tag) }
            })
            this.tagsChange.emit(tagIds)
          }
        } else {
          this.tags.push(value.trim())
          let tagIds = this.tags.map((tag) => {
            return { id: this.allTags.indexOf(tag) }
          })
          this.tagsChange.emit(tagIds)
        }
      }
      if (input) input.value = ''

      this.tagCtrl.setValue(null)
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag)

    if (index >= 0) this.tags.splice(index, 1)
    let tagIds = this.tags.map((tag) => {
      return { id: this.allTags.indexOf(tag) }
    })
    this.tagsChange.emit(tagIds)
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue

    if (this.match) {
      if (this.allTags.includes(value) && !this.tags.includes(value)) {
        this.tags.push(event.option.viewValue)
        let tagIds = this.tags.map((tag) => {
          return { id: this.allTags.indexOf(tag) }
        })
        this.tagsChange.emit(tagIds)
      }
    } else {
      this.tags.push()
      let tagIds = this.tags.map((tag) => {
        return { id: this.allTags.indexOf(tag) }
      })
      this.tagsChange.emit(tagIds)
    }

    this.tagCtrl.setValue(null)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()

    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    )
  }
}
