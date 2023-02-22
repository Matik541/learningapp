import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { User } from 'src/environments/environment'
import { UsersService } from 'src/app/users.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  userIdSub: any

  userId: number | 'me'
  user: User

  active: boolean[] = []

  constructor(
    private usersService: UsersService,
    private activeRoute: ActivatedRoute,
    private route: Router
  ) {
    this.userIdSub = this.activeRoute.params.subscribe((params) => {
      this.userId = params['id']
      if (this.userId != 'me' && +this.userId)
        this.usersService.getUserById(+this.userId).subscribe((data) => {
          this.user = data
        })
      else if (this.userId == 'me')
        this.usersService.getMe().subscribe((data) => {
          this.user = data
        })
      else this.route.navigate(['./'])
    })

    this.activeRoute.fragment.subscribe((fragment) => {
      this.active = [false, false, false]
      switch (fragment) {
        case 'done':
          this.active[0] = true
          break
        case 'learning':
          this.active[1] = true
          break
        case 'created':
          this.active[2] = true
          break
      }
    })
  }

  ngOnDestroy() {
    this.userIdSub.unsubscribe()
  }
}
