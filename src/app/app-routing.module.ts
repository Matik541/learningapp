import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LessonComponent } from './components/lesson/lesson.component';

const routes: Routes = [
  { path: 'lesson/:id', component: LessonComponent },
  // { path: '**',  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
