import { Component } from '@angular/core';

import { appName } from 'src/environments/environment';

/**
 * @title Basic menu
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})

export class NavbarComponent {
  
  appName: string = appName;

  constructor() { 
    // on start*
    // *do not recommend to use it if no need
  }

  ngOnInit() { 
    // on app initialize
  }
}