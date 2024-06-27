import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  onSubmit() {
    if (this.loginData.valid) {
      console.log(this.loginData.value)
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
