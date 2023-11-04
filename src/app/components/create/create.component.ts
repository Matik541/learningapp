import { Flashcard } from './../../enums/enums';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  detailsFormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    tags: [[''], Validators.required],
  });
  flashcardFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}
}
