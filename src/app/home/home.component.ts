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
  user: User = null

  constructor(
    private lessonsService: LessonsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.sections.forEach(
      (section) => (section.block = this.getBlocks(section.get))
    )
    this.user = this.usersService.loggedUser
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.sections.forEach(
      (section) => (section.block = this.getBlocks(section.get))
    )
    this.user = this.usersService.loggedUser
  }

  sections: {
    title: string
    block: Block[]
    get: number[] | 'all'
    mustLoggin: boolean
  }[] = [
    { title: 'last opened', block: [], get: [1, 2, 3, 4], mustLoggin: false },
    {
      title: 'All lessons',
      block: [],
      get: 'all',
      mustLoggin: false,
    },
    {
      title: 'your lessons',
      block: [],
      get: [5, 6, 7, 8, 9, 10],
      mustLoggin: true,
    },
  ]

  getBlocks(id: number[] | 'all'): any {
    let blocks: Block[] = []
    if (id == 'all') {
      this.lessonsService.getLessons().subscribe((data) => {
        data.forEach((lesson) => {
          if (lesson != null)
            blocks.push({
              title: lesson.title,
              icon: lesson.iconPath,
              id: lesson.id,
            })
        })
      })
    } else
      id.forEach((id) => {
        this.lessonsService.getLesson(id).subscribe((data) => {
          if (data != null)
            blocks.push({
              title: data.title,
              icon: data.iconPath,
              id,
            })
        })
      })
    return blocks
  }
}
