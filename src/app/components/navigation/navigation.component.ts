import { UsersService } from './../../services/users.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBar, ProgressBarService } from 'src/app/services/progress-bar.service';
import { AuthComponent } from '../auth/auth.component';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  public progressBar: ProgressBar;

  constructor(
    public progressBarService: ProgressBarService,
    public usersServices: UsersService,
    public dialog: MatDialog,
  ) { 
    this.progressBar = this.progressBarService.createBar('navigation', 100);
    this.progressBar.current = 0;
  }

  create() {
    console.log('create');
  }

  login() {
    let loginDialog = this.dialog.open(AuthComponent)

    
  }
}
