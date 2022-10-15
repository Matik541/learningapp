import { User } from './../../../environments/environment';
import { UsersService } from './../../users.service';
import { Component, Input, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonsService } from '../../lessons.service';
import { CreateComponent } from '../../lessons/create/create.component';

type Block = {
  title: string,
  icon: string,
  id: number
}
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})

@Injectable()
export class SectionComponent implements OnInit {
  @Input() label: string;
  @Input() blocks: Block[] = [];
  @Input() mustloggin: boolean;

  logged: User = this.usersService.isLogged();

  constructor(public dialog: MatDialog, private usersService: UsersService, private LessonsService: LessonsService) { }

  ngOnInit(): void { }

  addNew(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}