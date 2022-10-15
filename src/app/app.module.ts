import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarCreateComponent } from './navbar/create/create.component';
import { NavbarSearchComponent } from './navbar/search/search.component';
import { NavbarUserComponent } from './navbar/user/user.component';
import { SectionComponent } from './sections/section/section.component';
import { SectionsComponent } from './sections/sections.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { CreateComponent } from './lessons/create/create.component';
import { AutocompleteTagsComponent } from './components/autocomplete-tags/autocomplete-tags.component';
import { ErrorsComponent } from './components/errors/errors.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbarCreateComponent,
    NavbarSearchComponent,
    NavbarUserComponent,
    SectionComponent,
    SectionsComponent,
    LoginComponent,
    RegisterComponent,
    CreateComponent,
    AutocompleteTagsComponent,
    ErrorsComponent
  ],
  imports: [
    DragScrollModule,
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
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
