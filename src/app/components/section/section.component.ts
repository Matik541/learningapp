import { UsersService } from '../../users.service'
import {
  Component,
  Input,
  OnInit,
  Inject,
  Injectable,
  SimpleChanges,
} from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { LessonsService } from '../../lessons.service'
import { CreateComponent } from '../../lessons/create/create.component'

type Block = {
  title: string
  icon: string
  id: number
}
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
@Injectable()
export class SectionComponent implements OnInit {
  @Input() label: string
  @Input() blocks: Block[] = []
  @Input() mustloggin: boolean

  constructor(
    public dialog: MatDialog,
    public usersService: UsersService,
    private LessonsService: LessonsService
  ) {}

  ngOnInit(): void {}

  public addNew(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(CreateComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }
}
