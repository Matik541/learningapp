import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatChipsModule } from '@angular/material/chips'
import { BrowserModule } from '@angular/platform-browser'
import { MaterialExampleModule } from 'src/material.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './auth/login/login.component'
import { RegisterComponent } from './auth/register/register.component'
import { AutocompleteTagsComponent } from './components/autocomplete-tags/autocomplete-tags.component'
import { ErrorsComponent } from './components/errors/errors.component'
import { SectionComponent } from './components/section/section.component'
import { HomeComponent } from './home/home.component'
import { CreateComponent } from './lessons/create/create.component'
import { FlashcardComponent } from './lessons/create/flashcard/flashcard.component'
import { LessonComponent } from './lessons/lesson/lesson.component'
import { NavbarComponent } from './navbar/navbar.component'
import { NavbarSearchComponent } from './navbar/search/search.component'
import { NavbarUserComponent } from './navbar/user/user.component'
import { FlashcardsComponent } from './lessons/lesson/flashcards/flashcards.component'
import { LearnComponent } from './lessons/lesson/learn/learn.component'
import { QuizComponent } from './lessons/lesson/quiz/quiz.component'
import { CommentsComponent } from './lessons/lesson/comments/comments.component'
import { ErrorComponent } from './error/error.component'
import { QuestionWriteComponent } from './lessons/lesson/quiz/question-write/question-write.component'
import { QuestionMatchComponent } from './lessons/lesson/quiz/question-match/question-match.component'
import { QuestionChooseComponent } from './lessons/lesson/quiz/question-choose/question-choose.component'
import { ResultComponent } from './lessons/lesson/quiz/result/result.component'
import { FlashcardsCardsComponent } from './lessons/lesson/flashcards/cards/cards.component'
import { CommentsCardsComponent } from './lessons/lesson/comments/cards/cards.component';
import { ProfileComponent } from './profile/profile.component';
import { SocialShareComponent } from './components/social-share/social-share.component'
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbarSearchComponent,
    NavbarUserComponent,
    SectionComponent,
    LoginComponent,
    RegisterComponent,
    CreateComponent,
    AutocompleteTagsComponent,
    ErrorsComponent,
    FlashcardComponent,
    LessonComponent,
    HomeComponent,
    FlashcardsComponent,
    LearnComponent,
    QuizComponent,
    CommentsComponent,
    ErrorComponent,
    QuestionWriteComponent,
    QuestionMatchComponent,
    QuestionChooseComponent,
    ResultComponent,
    FlashcardsCardsComponent,
    CommentsCardsComponent,
    ProfileComponent,
    SocialShareComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatChipsModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
