import { TagsService } from 'src/app/services/tags.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Flashcard, NewLesson, Tag } from 'src/app/enums/enums';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { LessonsService } from '../lesson/lessons.service';
import { Router } from '@angular/router';
import { iconSet } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  rowCount = 1;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  detailsFormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    tagsCtrl: [''],
  });

  flashcards = new FormControl([] as Flashcard[], [
    Validators.minLength(4),
    Validators.required,
  ]);

  flashcardFormGroup = this.formBuilder.group({
    question: ['', Validators.required],
    answer: ['', Validators.required],
  });

  filteredTags: Observable<Tag[]> = of([]);
  tags: Tag[] = [];
  allTags: Tag[] = [];

  iconSet = [...iconSet];
  selectedIcon: string = iconSet[0];

  @ViewChild('tagInput') tagInput!: ElementRef;
  @ViewChild('question') question!: ElementRef;
  @ViewChild('stepper', { read: MatStepper }) stepper!: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private formBuilder: FormBuilder,
    private tagsService: TagsService,
    private breakpointObserver: BreakpointObserver,
    private lessonsService: LessonsService,
    private router: Router
  ) {
    this.tagsService.getTags().subscribe((tags) => {
      console.log(tags);
      this.allTags = tags;
      this.filteredTags = of(tags.slice(0, 5));
    });

    this.detailsFormGroup.valueChanges.subscribe((form) => {
      this.filteredTags = of(this._filter(form.tagsCtrl));
    });

    this.detailsFormGroup.valueChanges.subscribe((value) => {
      this.rowCount = value.description?.split(/\n/g).length || 1;
    });

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  sortIconSet() {
    this.iconSet = [];
    this.iconSet = [...iconSet]
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let inputed = this.allTags.filter(
      (item) =>
        item.tagName.toLowerCase().includes(value.toLocaleLowerCase()) &&
        !this.tags.includes(item)
    )[0];

    if (inputed && !this.tags.includes(inputed)) {
      this.tags.push(inputed);
    }

    if (input) {
      input.value = '';
    }

    this.detailsFormGroup.controls.tagsCtrl.setValue(null);
  }

  removeTag(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    this.filteredTags = of(this._filter(this.detailsFormGroup.value.tagsCtrl));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    let selected = this.allTags.find(
      (item) => item.tagName === event.option.viewValue
    );
    if (selected && !this.tags.includes(selected)) {
      this.tags.push(selected);
    }

    this.filteredTags = of(this._filter(this.detailsFormGroup.value.tagsCtrl));

    this.detailsFormGroup.controls.tagsCtrl.setValue(null);
    this.tagInput.nativeElement.value = '';
  }

  private _filter(value: string | undefined | null): Tag[] {
    return this.allTags.filter(
      (item) =>
        item.tagName.toLowerCase().includes(value ?? '') &&
        !this.tags.includes(item)
    );
  }

  addFlashcard() {
    if (this.flashcardFormGroup.invalid) return;

    let flashcards = [this.flashcardFormGroup.value as Flashcard];
    if (this.flashcards.value) flashcards.push(...this.flashcards.value);

    this.flashcards.setValue(flashcards);

    this.flashcardFormGroup.reset();
    this.flashcardFormGroup.markAsUntouched();

    this.question.nativeElement.focus();
  }

  removeFlashcard(flashcard: Flashcard) {
    if (!this.flashcards.value) return;

    let index = this.flashcards.value.indexOf(flashcard);

    if (index >= 0) {
      this.flashcards.value.splice(index, 1);
    }
  }

  reset() {
    this.flashcards.setValue([]);
    this.stepper.reset();
  }

  create() {
    if (this.detailsFormGroup.invalid) return;
    if (this.flashcards.invalid) return;

    let form = this.detailsFormGroup.value;
    let flashcards = this.flashcards.value;

    let lesson: NewLesson = {
      title: form.title ?? '',
      description: form.description ?? '',
      tags: this.tags,
      flashcards: flashcards ?? [],
      iconPath: this.selectedIcon,
    };

    this.lessonsService.addLesson(lesson).subscribe((lesson) => {
      if (lesson.id) return;

      this.router.navigate(['/lesson', lesson.id]);
    });
  }
}
