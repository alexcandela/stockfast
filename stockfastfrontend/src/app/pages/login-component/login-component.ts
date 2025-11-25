import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification-service';

import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitData() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.authService.setToken(res.token);
          if (this.authService.isTokenValid(res.token)) {
            this.router.navigate(['/general']);
            this.loginForm.reset();
          } else {
            console.error('Token inválido');
          }
        }
      },
      error: (err) => {
        if (err.error.error === 'Credenciales inválidas') {
          this.loginForm.setErrors({ invalid: true });
        } else {
          this.notificationService.error('Error al hacer iniciar sesión');
        }
      },
    });
  }

  demo() {
    this.loginForm.patchValue({
      email: 'johndoe@gmail.com',
      password: 'St@ckfast19'
    });

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.authService.setToken(res.token);
          if (this.authService.isTokenValid(res.token)) {
            this.router.navigate(['/general']);
            this.loginForm.reset();
          } else {
            console.error('Token inválido');
          }
        }
      },
      error: (err) => {
        if (err.error.error === 'Credenciales inválidas') {
          this.loginForm.setErrors({ invalid: true });
        } else {
          this.notificationService.error('Error al hacer iniciar sesión');
        }
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/general']);
    }
  }
}
