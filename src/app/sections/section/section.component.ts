import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  title: string;

  constructor() { }

  ngOnInit(): void {
  }

  blocks = [
    { title: "Block 1", icon: "tab unselected" },
    { title: "Block 2", icon: "folder" },
    { title: "Block 3", icon: "folder_open" },
    { title: "Block 4", icon: "view_agenda" },
    { title: "Block 5", icon: "space_dashboard" },
    { title: "Block 6", icon: "view_carousel" },
    { title: "Block 7", icon: "space_dashboard" },
  ]
}
