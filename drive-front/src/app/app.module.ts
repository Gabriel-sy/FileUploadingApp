import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FileComponent } from './components/file/file.component';
import { provideHttpClient } from '@angular/common/http';
import { FolderComponent } from './components/folder/folder.component';
import { FolderFilesComponent } from './components/folder-files/folder-files.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FileComponent,
    FolderComponent,
    FolderFilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
