import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
  selector: 'nav-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  loged: null | { name: string; } = null;

  openDialog(type: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialog: any = (type == 'login' ? LoginComponent : RegisterComponent);
    this.dialog.open(dialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  sin() {
    console.log("Sin")
    this.loged = { name: "User name" };
  }

  sup() {
    console.log("Sup")
    this.loged = { name: "New user" };
  }
  lout() {
    console.log("Lout")
    this.loged = null;
  }
}