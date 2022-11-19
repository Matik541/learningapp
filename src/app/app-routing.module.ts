import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { LoginComponent } from './auth/login/login.component'
import { RegisterComponent } from './auth/register/register.component'
import { LessonComponent } from './lessons/lesson/lesson.component'
import { HomeComponent } from './home/home.component'
import { ErrorComponent } from './error/error.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: '', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'lesson/:id',
    redirectTo: '/lesson/:id/flashcards',
    pathMatch: 'full',
  },
  { path: 'lesson/:id/:category', component: LessonComponent },
  {
    path: 'profile/:id',
    component: /*ProfileComponent | delete ->*/ HomeComponent,
  },
  { path: '**', component: ErrorComponent },
]
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
