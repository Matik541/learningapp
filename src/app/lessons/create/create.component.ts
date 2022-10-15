import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LessonsService } from '../../lessons.service';
import { UsersService } from 'src/app/users.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

type Tags = { name: string };

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  @Output() result = new EventEmitter<{ key: string, data: Array<string> }>();

  @Input() data: Array<string> = [];
  @Input() key: string = '';

  selectControl = new FormControl();

  filterString: string = '';
  formGroup: FormGroup;
  lesson: { title: string, description: string, icon: string, author: number, flashcards: any[], tags: string[] };

  // TODO: get tags from database

  constructor(public dialogRef: MatDialogRef<CreateComponent>, private lessonsService: LessonsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      description: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      icon: new FormControl('', [Validators.required]),
    });
  }

  create() {
    this.lesson = {
      author: this.usersService.isLogged()?.id,
      flashcards: [],
      tags: [],
      ...this.formGroup.value
    }
    console.log(this.lesson);
  }
}