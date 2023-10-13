import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor, NgForOf } from '@angular/common';

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchBarComponent } from './components/navigation/search-bar/search-bar.component';
import { FlashcardsComponent } from './components/lesson/flashcards/flashcards.component';
import { QuizComponent } from './components/lesson/quiz/quiz.component';
import { CommentsComponent } from './components/lesson/comments/comments.component';
import { PractiseComponent } from './components/lesson/practise/practise.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { MatchComponent } from './components/lesson/methods/match/match.component';
import { BooleanComponent } from './components/lesson/methods/boolean/boolean.component';
import { WriteComponent } from './components/lesson/methods/write/write.component'

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SearchBarComponent,
    FlashcardsComponent,
    QuizComponent,
    CommentsComponent,
    PractiseComponent,
    LessonComponent,
    MatchComponent,
    BooleanComponent,
    WriteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgFor,
    NgForOf,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
