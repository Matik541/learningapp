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

  // REVERSE!
  blocks = [
    { title: "Block 5", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." },
    { title: "Block 4", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." },
    { title: "Block 3", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." },
    { title: "Block 2", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." },
    { title: "Block 1", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." },
  ]

}
