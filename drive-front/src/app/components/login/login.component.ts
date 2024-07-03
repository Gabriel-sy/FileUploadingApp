import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Jwt } from '../../services/Jwt';


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

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {

  }

  onSubmit() {
    if (this.loginData.valid) {
      var values = this.loginData.value;
      if (values.login && values.password) {
        this.authService.login(values.login, values.password)
        .subscribe((res: Jwt) => {
          this.authService.setSession(res.jwt)
        });
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
