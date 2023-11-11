import { UsersService } from '../auth/users.service'
import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import {
  ProgressBar,
  ProgressBarService,
} from 'src/app/services/progress-bar.service'
import { AuthComponent } from '../auth/auth.component'
import { Router } from '@angular/router'
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public progressBar: ProgressBar

  constructor(
    public progressBarService: ProgressBarService,
    public usersServices: UsersService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.progressBar = this.progressBarService.createBar('navigation', 100)
    this.progressBar.current = 0
  }

  create() {
    this.router.navigate(['/create'])
  }

  login() {
    this.dialog.open(AuthComponent, {
      disableClose: true,
    })
  }

  logout() {
    this.usersServices.authLogout()
  }
}
