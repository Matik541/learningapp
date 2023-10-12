import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchBarComponent } from './components/navigation/search-bar/search-bar.component';
import { FlashcardsComponent } from './components/lesson/flashcards/flashcards.component';
import { QuizComponent } from './components/lesson/quiz/quiz.component';
import { CommentsComponent } from './components/lesson/comments/comments.component';
import { PractiseComponent } from './components/lesson/practise/practise.component';
import { LessonComponent } from './components/lesson/lesson.component'

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SearchBarComponent,
    FlashcardsComponent,
    QuizComponent,
    CommentsComponent,
    PractiseComponent,
    LessonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
