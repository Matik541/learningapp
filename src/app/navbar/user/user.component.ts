import { Component, OnInit } from '@angular/core'
import { UsersService } from '../../users.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { LoginComponent } from '../../auth/login/login.component'
import { RegisterComponent } from '../../auth/register/register.component'
import { User } from 'src/environments/environment'

@Component({
  selector: 'nav-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class NavbarUserComponent implements OnInit {
  logged: User = this.usersService.loggedUser

  constructor(public dialog: MatDialog, private usersService: UsersService) {
    this.logged = this.usersService.loggedUser
  }

  ngOnInit(): void {}

  openDialog(
    type: string,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    let dialog: any = type == 'login' ? LoginComponent : RegisterComponent
    this.dialog.open(dialog, {
      width: '30vw',
      enterAnimationDuration,
      exitAnimationDuration,
    })

    this.dialog.afterAllClosed.subscribe(() => {
      this.checkLogin()
    })
  }

  logout() {
    this.usersService.logout()
    this.checkLogin()
  }

  checkLogin() {
    this.logged = this.usersService.loggedUser
  }
}
