import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'errors',
  template: '{{ this.innerHTML }}'
})
export class ErrorsComponent implements OnInit {
  @Input() innerHTML: string;
  
  constructor() { }

  ngOnInit(): void { }
}
