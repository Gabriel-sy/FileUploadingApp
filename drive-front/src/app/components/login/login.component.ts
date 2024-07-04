import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Jwt } from '../Jwt';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  })

  isSubmitted: boolean = false;
  isCredentialsInvalid: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {

  }

  onSubmit() {
    if (this.loginData.valid) {
      var values = this.loginData.value;
      if (values.login && values.password) {
        this.authService.login(values.login, values.password)
          .subscribe({
            next: (res) => {this.authService.setSession(res.jwt)
            },
            error: () => {this.isCredentialsInvalid = true},
            complete: () => this.router.navigateByUrl('home')
          }
          );
      }
    }
    this.isSubmitted = true;
  }

  isLoginInvalid() {
    if (this.loginData.get('login')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }

  isPasswordInvalid() {
    if (this.loginData.get('password')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }


}
