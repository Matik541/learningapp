import { Component, OnInit } from '@angular/core';
import { SectionComponent } from './section/section.component'

@Component({
  selector: 'sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sections = [
    new SectionComponent(),
    new SectionComponent(),
  ]

}
