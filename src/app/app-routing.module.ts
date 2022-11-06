import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { LoginComponent } from './auth/login/login.component'
import { RegisterComponent } from './auth/register/register.component'
import { LessonComponent } from './lessons/lesson/lesson.component'
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: '', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'lesson/:id', component: LessonComponent },
  {
    path: 'profile/:id',
    component: /*ProfileComponent | delete ->*/ HomeComponent,
  },
]
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
