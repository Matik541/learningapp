import { Component } from '@angular/core'
import { UsersService } from './users.service'
import { LessonsService } from './lessons.service'
import { appName, User, bar } from 'src/environments/environment'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}
  ngOnInit(): void {}
}
