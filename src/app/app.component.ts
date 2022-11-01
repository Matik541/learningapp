import { Component } from '@angular/core'
import { UsersService } from './users.service'
import { LessonsService } from './lessons.service'
import { appName, User } from 'src/environments/environment'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = appName
  loggedUser: User = null

  constructor(
    private usersService: UsersService,
    private LessonsService: LessonsService
  ) {}

  ngOnInit(): void {}
}
