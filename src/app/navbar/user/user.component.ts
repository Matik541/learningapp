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

  logged: null | { email: string, nickname: string, id: number } = this.usersService.isLogged();

  constructor(public dialog: MatDialog, private usersService: UsersService) { }

  ngOnInit(): void { }

  openDialog(type: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialog: any = (type == 'login' ? LoginComponent : RegisterComponent);
    this.dialog.open(dialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.checkLogin();
    });
  }

  logout() {
    this.usersService.logout();
    this.checkLogin();
  }

  checkLogin() {
    this.logged = this.usersService.isLogged();
  }
}