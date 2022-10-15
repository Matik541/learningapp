import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateComponent } from '../../lessons/create/create.component';

@Component({
  selector: 'nav-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class NavbarCreateComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addNew(type: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialog: any = (type == 'lesson' ? CreateComponent : CreateComponent);
    this.dialog.open(dialog, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
