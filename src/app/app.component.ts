import { Component } from '@angular/core';
import { UsersService } from './users.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'LearningApp';

  constructor(private usersService: UsersService) { }

  login(email: string, password: string) {
    this.usersService.login(email, password).subscribe((data) => {
      console.log(data);
    })
  }
  logout() {
    this.usersService.logout().subscribe((data) => {
      console.log(data);
    })
  }
  register(username: string, email: string, password: string) {
    this.usersService.register(username, email, password).subscribe((data) => {
      console.log(data);
    })
  }
}
