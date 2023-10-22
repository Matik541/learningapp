import { Component } from '@angular/core';
import { ProgressBar, ProgressBarService } from 'src/app/services/progress-bar.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  public progressBar: ProgressBar;

  constructor(
    public progressBarService: ProgressBarService
  ) { 
    this.progressBar = this.progressBarService.createBar('navigation', 100);
    this.progressBar.current = 0;
  }

  create() {
    console.log('create');
  }
}