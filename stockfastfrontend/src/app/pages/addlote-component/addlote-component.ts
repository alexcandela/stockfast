import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
  FormArray,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Producto } from '../../core/interfaces/product';
import { LoteService } from '../../core/services/lote-service';

import { ProductloteComponent } from '../../components/productlote-component/productlote-component';

@Component({
  selector: 'app-addlote-component',
  imports: [ReactiveFormsModule, FormsModule, ProductloteComponent],
  templateUrl: './addlote-component.html',
  styleUrl: './addlote-component.scss',
})
export class AddloteComponent {
  productoForm: FormGroup;
  loteForm: FormGroup;
  productos: Producto[] = [];

  categorias = [
    { nombre: 'Electrónica' },
    { nombre: 'Ropa' },
    { nombre: 'Calzado' },
    { nombre: 'Juguetes' },
    { nombre: 'Accesorios' },
    { nombre: 'Joyas' },
    { nombre: 'Relojes' },
  ];

  constructor(private fb: FormBuilder, private loteService: LoteService) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(0)]],
      venta: [null, [Validators.required, Validators.min(0)]],
      categoria: [null, [Validators.required]],
      desc: ['', [Validators.maxLength(100)]],
    });

    this.loteForm = this.fb.group({
      proveedor: [''],
      agenciaenvio: [''],
      gastosenvio: [null, [Validators.required, Validators.min(0)]],
      fechacompra: ['', [Validators.required, this.fechaAnteriorValidator()]],
      productos: this.fb.array([]),
    });
  }


  // Validator para fecha de compra, verificar que la fecha es anterior al día actual
  fechaAnteriorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null; // no validar si está vacío, se usará Validators.required

    const fechaIngresada = new Date(valor);
    const hoy = new Date();

    // Ajustamos horas a 0 para comparar solo fechas
    fechaIngresada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    return fechaIngresada <= hoy ? null : { fechaFutura: true };
  };
}


  // Seleccionar la categoria del producto
  seleccionarCategoria(nombre: string) {
    this.productoForm.get('categoria')?.setValue(nombre);
  }

  // Añadir producto al lote
  addProduct() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const nuevoProducto = this.productoForm.value;
    this.productos.push(nuevoProducto);
    this.productoForm.reset();
  }

  // Eliminar producto de la lista
  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
  }

  // Añadir lote completo
  addLote() {
    if (this.productos.length === 0) {
      this.productoForm.markAllAsTouched();
      return;
    }

    if (this.loteForm.invalid) {
      this.loteForm.markAllAsTouched();
      return;
    }

    const nuevoLote = {
      ...this.loteForm.value,
      productos: this.productos,
    };

    this.loteService.crearLote(nuevoLote).subscribe({
    next: (res) => {
      console.log(res);
      
      this.loteForm.reset();
      this.productos = [];
    },
    error: (err) => console.error('Error al enviar lote:', err)
  });
  }
}
