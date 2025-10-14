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

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: Authservice, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
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
      error: (err) => console.error('Error al enviar lote:', err),
    });
  }
}
