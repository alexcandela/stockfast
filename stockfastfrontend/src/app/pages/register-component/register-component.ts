import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Authservice } from '../../core/services/authservice';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
          ],
        ],
        password_confirmation: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  submitData() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.authService.setToken(res.token); // guardamos token
          if (this.authService.isTokenValid(res.token)) {
            this.router.navigate(['/general']);
            this.registerForm.reset();
          } else {
            console.error('Token inválido');
          }
        }
      },
      error: (err) => {
        if (err.error.message === 'El nombre de usuario ya está en uso') {
          this.registerForm.get('username')?.markAsTouched();
          this.registerForm.get('username')?.setErrors({ unique: true });
        } else if (err.error.message === 'El correo electrónico ya está registrado') {
          this.registerForm.get('email')?.markAsTouched();
          this.registerForm.get('email')?.setErrors({ unique: true });
        } else {
          this.notificationService.error('Error al hacer registro');
          console.error('Error al hacer registro:', err.error.message);
        }
      },
    });
  }
}
