import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]]
  })


  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) { }

  onSubmit() {
    this.isSubmitted = true;
    if (this.registerData.valid) {
      console.log(this.registerData.value)
      this.router.navigateByUrl('');
    }
  }

  isLoginInvalid() {
    if (this.registerData.get('login')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }

  isPasswordInvalid() {
    if (this.registerData.get('password')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }


}
