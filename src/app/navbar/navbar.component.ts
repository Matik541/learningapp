import { Component } from '@angular/core';

/**
 * @title Basic menu
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})

export class NavbarComponent {
  app = {
    title: "LearningApp",
  }

  constructor() { 
    // on start*
    // *do not recommend to use it if no need
  }

  ngOnInit() { 
    // on app initialize
  }
}