import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { CreateComponent } from '../lessons/create/create.component'
import { appName } from 'src/environments/environment'

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  appName: string = appName

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  addNew(
    type: string,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    let dialog: any = type == 'lesson' ? CreateComponent : CreateComponent
    this.dialog.open(dialog, {
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }
}
