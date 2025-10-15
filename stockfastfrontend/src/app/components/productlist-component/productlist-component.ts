import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../core/interfaces/product';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Authservice } from '../../core/services/authservice';

import { CustomValidators } from '../../core/validators/custom-validators';

@Component({
  selector: 'app-productlist-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productlist-component.html',
  styleUrl: './productlist-component.scss',
})
export class ProductlistComponent {
  @Input() product!: Product;
  @Output() eliminar = new EventEmitter<any>();

  show: WritableSignal<boolean> = signal(false);

  saleForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: Authservice) {
    this.saleForm = this.fb.group({
      sale_price: ['', Validators.required],
      quantity: ['', Validators.required],
      sale_date: ['', [Validators.required, CustomValidators.fechaAnteriorValidator()]],
      product_id: [null],
    });
  }

  registrarVenta() {
    this.saleForm.patchValue({
      product_id: this.product.id,
    });
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }
    console.log(this.saleForm.value);
  }

  toggle() {
    this.show.set(!this.show());
  }
}
