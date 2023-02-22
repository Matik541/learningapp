import { Component } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/twitter.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'whatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/whatsapp.svg')
    )
  }
}
