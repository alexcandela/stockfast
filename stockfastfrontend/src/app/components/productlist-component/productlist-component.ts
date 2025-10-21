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

import { CustomValidators } from '../../core/validators/custom-validators';
import { SaleService } from '../../core/services/sale-service';

import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-productlist-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productlist-component.html',
  styleUrl: './productlist-component.scss',
})
export class ProductlistComponent {
  @Input() product!: Product;
  @Output() eliminar = new EventEmitter<any>();
  @Output() deleteProductFromArray = new EventEmitter<number>();

  show: WritableSignal<boolean> = signal(false);

  saleForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private notificationService: NotificationService
  ) {
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

    this.saleService.makeSale(this.saleForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success('Venta registrada correctamente');
          this.product.quantity -= this.saleForm.get('quantity')?.value;
          if (this.product.quantity <= 0) {
            this.deleteProductFromArray.emit(this.product.id);
          }
          this.saleForm.reset();
          this.show.set(false);
        }
      },
      error: (err) => {
        this.notificationService.error('Error al registrar la venta');
        console.error('Error al crear venta:', err);
      },
    });
  }

  toggle() {
    this.show.set(!this.show());
  }
}
