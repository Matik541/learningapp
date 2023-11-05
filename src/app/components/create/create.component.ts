import { TagsService } from './../../services/tags.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { Flashcard, Tag } from 'src/app/enums/enums'
import { Component, ElementRef, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { MatChipInputEvent } from '@angular/material/chips'
import { Observable, of } from 'rxjs'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  rowCount = 1
  separatorKeysCodes: number[] = [ENTER, COMMA]

  detailsFormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    tagsCtrl: [''],
  })
  flashcardFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  })

  filteredTags: Observable<Tag[]> = of([])
  tags: Tag[] = []
  allTags: Tag[] = [
    {
      id: 0,
      tagName: 'tag1',
    },
    {
      id: 1,
      tagName: 'tag2',
    },
  ]

  @ViewChild('tagInput') tagInput!: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private tagsService: TagsService,
  ) {
    tagsService.getTags().subscribe((tags) => {
      console.log(tags)
      this.allTags = tags
      this.filteredTags = of(tags.slice(0, 5))
    })

    this.detailsFormGroup.valueChanges.subscribe((form) => {
      this.filteredTags = of(this._filter(form.tagsCtrl))
    })

    this.detailsFormGroup.valueChanges.subscribe((value) => {
      this.rowCount = value.description?.split(/\n/g).length || 1
    })
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value

    let inputed = this.allTags.filter(
      (item) =>
        item.tagName.toLowerCase().includes(value.toLocaleLowerCase()) &&
        !this.tags.includes(item),
    )[0]

    if (inputed && !this.tags.includes(inputed)) {
      this.tags.push(inputed)
    }

    if (input) {
      input.value = ''
    }

    this.detailsFormGroup.controls.tagsCtrl.setValue(null)
  }

  removeTag(tag: Tag): void {
    const index = this.tags.indexOf(tag)

    if (index >= 0) {
      this.tags.splice(index, 1)
    }

    this.filteredTags = of(this._filter(this.detailsFormGroup.value.tagsCtrl))
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    let selected = this.allTags.find(
      (item) => item.tagName === event.option.viewValue,
    )
    if (selected && !this.tags.includes(selected)) {
      this.tags.push(selected)
    }

    this.filteredTags = of(this._filter(this.detailsFormGroup.value.tagsCtrl))

    this.detailsFormGroup.controls.tagsCtrl.setValue(null)
    this.tagInput.nativeElement.value = ''
  }

  private _filter(value: string | undefined | null): Tag[] {
    return this.allTags.filter(
      (item) =>
        item.tagName.toLowerCase().includes(value ?? "") && !this.tags.includes(item),
    )
  }
}
