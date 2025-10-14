import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: Authservice, private router: Router) {
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
      error: (err) => console.error('Error al enviar lote:', err),
    });
  }
}
