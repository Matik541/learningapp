import { Component } from '@angular/core';
import { UsersService } from './users.service';

import { appName } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private usersService: UsersService) { }

  ngOnInit(): void { }
}
