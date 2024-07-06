import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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
  modalDisplay: string = "none";
  isSubmitted: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  onSubmit() {
    this.isSubmitted = true;
    if (this.registerData.valid) {
      var values = this.registerData.value;
      if (values.login && values.password) {
        this.authService.register(values.login, values.password).subscribe({
          complete: () => this.redirect()
        });

      }
    }
  }

  isLoginInvalid(): boolean {
    if (this.registerData.get('login')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }

  isPasswordInvalid(): boolean {
    if (this.registerData.get('password')?.invalid && this.isSubmitted) {
      return true;
    }
    return false;
  }

  redirect(): void {
    this.router.navigateByUrl('login');
  }


}

