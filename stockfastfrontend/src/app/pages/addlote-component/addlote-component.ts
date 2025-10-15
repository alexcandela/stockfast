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

import { Product } from '../../core/interfaces/product';
import { PurchaseService } from '../../core/services/purchase-service';

import { ProductloteComponent } from '../../components/productlote-component/productlote-component';

import { CustomValidators } from '../../core/validators/custom-validators';

@Component({
  selector: 'app-addlote-component',
  imports: [ReactiveFormsModule, FormsModule, ProductloteComponent],
  templateUrl: './addlote-component.html',
  styleUrl: './addlote-component.scss',
})
export class AddloteComponent {
  productForm: FormGroup;
  purchaseForm: FormGroup;
  products: Product[] = [];

  categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Calzado' },
    { id: 4, nombre: 'Juguetes' },
    { id: 5, nombre: 'Accesorios' },
    { id: 6, nombre: 'Joyas' },
    { id: 7, nombre: 'Relojes' },
  ];

  constructor(private fb: FormBuilder, private purchaseService: PurchaseService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      purchase_price: [null, [Validators.required, Validators.min(0)]],
      estimated_sale_price: [null, [Validators.required, Validators.min(0)]],
      category_id: [null, [Validators.required]],
      description: ['', [Validators.maxLength(100)]],
    });

    this.purchaseForm = this.fb.group({
      supplier_name: [''],
      shipping_agency: [''],
      shipping_cost: [null, [Validators.required, Validators.min(0)]],
      purchase_date: ['', [Validators.required, CustomValidators.fechaAnteriorValidator()]],
      products: this.fb.array([]),
    });
  }
  
  // Seleccionar la categoria del producto
  seleccionarCategoria(id: number) {
    this.productForm.get('category_id')?.setValue(id);
  }

  // Añadir producto al lote
  addProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const nuevoProducto = this.productForm.value;
    this.products.push(nuevoProducto);
    this.productForm.reset();    
  }

  // Eliminar producto de la lista
  eliminarProducto(index: number) {
    this.products.splice(index, 1);
  }

  // Añadir lote completo
  addLote() {
    if (this.products.length === 0) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    const newPurchase = {
      ...this.purchaseForm.value,
      products: this.products,
    };

    this.purchaseService.crearLote(newPurchase).subscribe({
      next: (res) => {
        console.log(res);

        this.purchaseForm.reset();
        this.products = [];
      },
      error: (err) => console.error('Error al enviar lote:', err),
    });
  }
}
