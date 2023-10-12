import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LessonComponent } from './components/lesson/lesson.component'

const routes: Routes = [
  { path: 'lesson/:id', redirectTo: 'lesson/:id/flashcards', pathMatch: 'prefix'},
  { path: 'lesson/:id/:category', component: LessonComponent, pathMatch: 'prefix'},
  // { path: '**',  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
