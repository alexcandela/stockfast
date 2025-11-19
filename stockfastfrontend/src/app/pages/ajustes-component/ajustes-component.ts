import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsService } from '../../core/services/settings-service';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-ajustes-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajustes-component.html',
  styleUrls: ['./ajustes-component.scss'],
})
export class AjustesComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  notificationForm: FormGroup;
  loading = false;
  activeSection = 'perfil';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    // Formulario de contraseña
    this.passwordForm = this.fb.group(
      {
        current_password: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Formulario de notificaciones
    this.notificationForm = this.fb.group({
      email_notifications: [true],
      push_notifications: [true],
      sales_notifications: [true],
      stock_alerts: [true],
      marketing_emails: [false],
    });
  }

  ngOnInit(): void {
    this.loadUserData();

    // Limpiar error de duplicado cuando el usuario modifica el campo
    this.profileForm.get('username')?.valueChanges.subscribe(() => {
      if (this.profileForm.get('username')?.hasError('duplicate')) {
        this.profileForm.get('username')?.setErrors(null);
      }
    });

    this.profileForm.get('email')?.valueChanges.subscribe(() => {
      if (this.profileForm.get('email')?.hasError('duplicate')) {
        this.profileForm.get('email')?.setErrors(null);
      }
    });
  }

  /**
   * Cargar datos del usuario
   * TODO: Implementar llamada al servicio para obtener datos del usuario
   */
  loadUserData(): void {
    this.settingsService.getUserData().subscribe({
      next: (response) => {
        const user = response.user;
        this.profileForm.patchValue({
          name: user.name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
        });
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
  }

  /**
   * Actualizar perfil del usuario
   * TODO: Implementar llamada al servicio para actualizar perfil
   */
  updateProfile(): void {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;

      this.settingsService.updateUserProfile(profileData).subscribe({
        next: (response) => {
          this.notificationService.success('Perfil actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);

          if (error.status === 422 && error.error.errors) {
            const errors = error.error.errors;

            // Establecer error personalizado en el campo username
            if (errors.username) {
              this.profileForm.get('username')?.setErrors({ duplicate: true });
            }

            // Establecer error personalizado en el campo email
            if (errors.email) {
              this.profileForm.get('email')?.setErrors({ duplicate: true });
            }
          } else {
            this.notificationService.error('Error al actualizar el perfil');
          }
        },
      });
    } else {
      this.notificationService.error('Por favor, completa todos los campos correctamente');
    }
  }

  /**
   * Cambiar contraseña
   * TODO: Implementar llamada al servicio para cambiar contraseña
   */
  changePassword(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      const passwordData = {
        current_password: this.passwordForm.value.current_password,
        new_password: this.passwordForm.value.new_password,
      };

      console.log('changePassword() - Datos preparados:', passwordData);

      setTimeout(() => {
        this.loading = false;
        this.passwordForm.reset();
        alert('Contraseña cambiada correctamente (simulado)');
      }, 1000);
    } else {
      console.warn('Formulario de contraseña no válido');
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  /**
   * Actualizar preferencias de notificaciones
   * TODO: Implementar llamada al servicio para actualizar notificaciones
   */
  updateNotifications(): void {
    const notificationData = this.notificationForm.value;
    console.log('updateNotifications() - Datos preparados:', notificationData);
    alert('Preferencias de notificaciones actualizadas (simulado)');
  }

  /**
   * Eliminar cuenta del usuario
   * TODO: Implementar llamada al servicio para eliminar cuenta
   */
  deleteAccount(): void {
    const confirmDelete = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (confirmDelete) {
      console.log('deleteAccount() - Eliminación solicitada');
      alert('Cuenta eliminada correctamente (simulado)');
    }
  }

  /**
   * Validador personalizado para confirmar que las contraseñas coincidan
   */
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('new_password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Cambiar la sección activa en la navegación
   */
  setActiveSection(section: string): void {
    this.activeSection = section;
    console.log('Sección activa:', section);
  }

  /**
   * Helper: Marcar todos los campos del formulario como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
