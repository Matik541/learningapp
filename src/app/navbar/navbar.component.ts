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
  
  loged: null | { name: string; picture: string; } = null;
  // loged: null | { name: string; picture: string; } = { name: "User name" };

  constructor() { }

  ngOnInit() { 
    this.Lout();
  }

  Sin() { 
    console.log("Sin")
    this.loged = { name: "User name",  picture: "" };
  }
  Sup() { 
    console.log("Sup") 
    this.loged = { name: "New user",  picture: "" };
  }
  Lout() { 
    console.log("Lout")
    this.loged = null;
   }
}