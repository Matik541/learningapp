import { Component, OnInit } from '@angular/core'
import { LessonsService } from '../../lessons.service'
import { UsersService } from 'src/app/users.service'
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Lesson, Tag, Flashcard, AddLesson } from 'src/environments/environment'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  selectControl = new FormControl()

  filterString: string = ''
  isEditable: boolean = true

  formGroup1: FormGroup = this._formBuilder.group({
    title: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(.|\s)*[a-zA-Z]+(.|\s)*$/),
    ]),
    description: new FormControl('', [
      Validators.pattern(/^(.|\s)*[a-zA-Z]+(.|\s)*$/),
    ]),
  })

  flashcards: Flashcard[] = []

  canCreate: boolean = false

  // TODO: set icons presets
  icons = [
    'home',
    'work',
    'school',
    'flash_on',
    'face',
    'pets',
    'local_florist',
    'local_drink',
    'local_pizza',
    'local_cafe',
    'local_bar',
    'local_grocery_store',
    'local_library',
    'local_hospital',
    'local_pharmacy',
    'local_laundry_service',
    'local_post_office',
    'local_taxi',
    'local_parking',
    'local_gas_station',
    'local_police',
    'local_convenience_store',
    'local_dining',
    'local_cinema',
    'local_mall',
    'local_play',
    'local_see',
    'local_sports',
    'local_airport',
    'local_atm',
    'local_bank',
    'local_barber',
    'local_casino',
    'local_florist',
    'local_grocery_store',
    'local_hospital',
    'local_hotel',
    'local_laundry_service',
    'local_library',
    'local_mall',
    'local_movies',
    'local_offer',
    'local_parking',
    'local_pharmacy',
    'local_phone',
    'local_pizza',
    'local_play',
    'local_post_office',
    'local_printshop',
    'local_see',
    'local_shipping',
    'local_taxi',
    'local_bar',
    'local_cafe',
    'local_car_wash',
    'local_convenience_store',
    'local_dining',
    'local_drink',
    'local_florist',
    'local_gas_station',
    'local_grocery_store',
    'local_hospital',
    'local_hotel',
    'local_laundry_service',
    'local_library',
    'local_mall',
    'local_movies',
    'local_offer',
    'local_parking',
    'local_pharmacy',
    'local_phone',
    'local_pizza',
    'local_play',
    'local_post_office',
    'local_printshop',
    'local_see',
    'local_shipping',
    'local_taxi',
    'local_bar',
    'local_cafe',
    'local_car_wash',
    'local_convenience_store',
    'local_dining',
    'local_drink',
    'local_florist',
    'local_gas_station',
    'local_grocery_store',
    'local_hospital',
    'local_hotel',
    'local_laundry_service',
    'local_library',
    'local_mall',
    'local_movies',
    'local_offer',
    'local_parking',
    'local_pharmacy',
    'local_phone',
    'local_pizza',
    'local_play',
    'local_post_office',
    'local_printshop',
    'local_see',
    'local_shipping',
    'local_taxi',
  ]
  menuV: string = this.icons[0]

  lesson: AddLesson = {
    title: '',
    description: '',
    iconPath: this.icons[0],
    // creator: this.usersService.loggedUser,
    flashcards: [],
    tags: [],
  }

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateComponent>,
    private lessonsService: LessonsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {}

  create() {
    this.formGroup1.valueChanges.subscribe((value) => {
      console.log(value)
    })

    this.lesson.title = this.formGroup1.value.title
    this.lesson.description = this.formGroup1.value.description || ''
    console.log(this.usersService.loggedUser)
    // this.lesson.creator = this.usersService.loggedUser
    this.lesson.iconPath = this.menuV
    this.lesson.flashcards = this.flashcards
    this.lesson.tags = this.lesson.tags
    console.log(this.lesson)

    this.lessonsService.create(this.lesson).subscribe((lesson) => {
      console.log(lesson)
      if (lesson) this.dialogRef.close()
    })
  }
  refreshTags(event: Tag[]) {
    this.lesson.tags = event
  }

  // flashcards
  addFlashcard() {
    this.flashcards.push({
      question: '',
      answer: '',
    })
  }
  removeFlashcard(event: Flashcard, id: number) {
    console.log(this.flashcards)
    console.log(event)
    this.flashcards = this.flashcards.filter((f) => f !== event)
    console.log(this.flashcards)
  }
  refreshFlashcards(event: Flashcard, id: number) {
    console.log(this.flashcards)
    this.flashcards[id] = event
  }
}
