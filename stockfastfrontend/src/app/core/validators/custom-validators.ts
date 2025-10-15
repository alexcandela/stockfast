import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validator para fecha de compra, verificar que la fecha es anterior al día actual
  static fechaAnteriorValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;

      const fechaIngresada = new Date(valor);
      const hoy = new Date();

      fechaIngresada.setHours(0, 0, 0, 0);
      hoy.setHours(0, 0, 0, 0);

      return fechaIngresada <= hoy ? null : { fechaFutura: true };
    };
  }
}
