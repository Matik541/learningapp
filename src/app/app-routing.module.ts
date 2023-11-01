import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LessonComponent } from './components/lesson/lesson.component'
import { LoginComponent } from './components/auth/login/login.component'
import { RegisterComponent } from './components/auth/register/register.component'
import { HomeComponent } from './components/home/home.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile/:id',
    redirectTo: 'lesson/1',
    pathMatch: 'prefix',
  },

  {
    path: 'lesson/:id',
    redirectTo: 'lesson/:id/flashcards',
    pathMatch: 'prefix',
  },
  {
    path: 'lesson/:id/:category',
    component: LessonComponent,
    pathMatch: 'prefix',
  },
  // { path: '**',  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
