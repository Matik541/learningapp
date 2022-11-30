import { Component, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { CreateComponent } from '../lessons/create/create.component'
import { appName, Bar } from 'src/environments/environment'
import { NavigationEnd, NavigationStart, Router } from '@angular/router'
import { ProgressBarService } from './progress-bar.service'

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  appName: string = appName
  loading: Bar = {
    mode: 'determinate',
    value: 0,
    hidden: true,
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public progressBar: ProgressBarService
  ) {}
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        this.loading.hidden = false
        this.loading.value = 0
      }
      if (evt instanceof NavigationEnd) {
        this.loading.value = 100
        setTimeout(() => {
          this.loading.hidden = true
        }, 250)
        setTimeout(() => {
          this.loading.value = 0
        }, 500)
      }
    })
  }

  addNew(
    type: string,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    let dialog: any = type == 'lesson' ? CreateComponent : CreateComponent
    this.dialog.open(dialog, {
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }
}
