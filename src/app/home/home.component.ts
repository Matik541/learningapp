import { User } from './../../environments/environment'
import { Component, OnInit, SimpleChanges } from '@angular/core'
import { LessonsService } from '../lessons.service'
import { UsersService } from '../users.service'

type Block = {
  title: string
  icon: string
  id: number
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  LessonsService: any
  user: User = null

  constructor(
    private lessons: LessonsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.sections.forEach(
      (section) => (section.block = this.getBlocks(section.get))
    )
    this.user = this.usersService.isLogged()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.sections.forEach(
      (section) => (section.block = this.getBlocks(section.get))
    )
    this.user = this.usersService.isLogged()
  }

  sections = [
    { title: 'last opened', block: [], get: [1, 2, 3, 4], mustloggin: false },
    {
      title: 'most popular',
      block: [],
      get: [11, 12, 13, 14, 15, 16, 17, 18, 19],
      mustloggin: false,
    },
    {
      title: 'your lessons',
      block: [],
      get: [5, 6, 7, 8, 9, 10],
      mustloggin: true,
    },
  ]

  getBlocks(id: number[]): any {
    let blocks: Block[] = []
    id.forEach((id) => blocks.push(this.lessons.getFlashcards(id)))
    return blocks
  }
}
