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
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { FolderComponent } from './components/folder/folder.component';
import { FolderFilesComponent } from './components/folder-files/folder-files.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';

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
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
