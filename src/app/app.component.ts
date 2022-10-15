import { Component } from '@angular/core';
import { UsersService } from './users.service';
import { LessonsService } from './lessons.service';
import { appName } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = appName;
  constructor(private usersService: UsersService, private LessonsService: LessonsService) { }

  ngOnInit(): void { }
}
