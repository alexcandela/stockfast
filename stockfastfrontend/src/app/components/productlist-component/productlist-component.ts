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
import { ProductService } from '../../core/services/product-service';

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
  activeForm = signal<'sale' | 'edit' | 'delete' | null>(null);

  saleForm: FormGroup;
  deleteForm: FormGroup;
  editForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private notificationService: NotificationService,
    private productService: ProductService
  ) {
    this.saleForm = this.fb.group({
      sale_price: ['', Validators.required],
      quantity: ['', Validators.required],
      sale_date: ['', [Validators.required, CustomValidators.fechaAnteriorValidator()]],
      product_id: [null],
    });
    this.deleteForm = this.fb.group({
      product_id: ['', Validators.required],
    });
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      purchase_price: [null, [Validators.required, Validators.min(0)]],
      estimated_sale_price: [null, [Validators.required, Validators.min(0)]],
      category_id: [null, [Validators.required]],
      description: ['', [Validators.maxLength(100)]],
    });
  }

  // Método para alternar formularios
  toggleForm(formType: 'sale' | 'edit' | 'delete' | null) {
    if (this.activeForm() === formType) {
      this.activeForm.set(null);
      this.show.set(false);
    } else {
      this.activeForm.set(formType);
      this.show.set(true);
    }
  }

  // Eliminar producto
  deleteProduct = (productId: number) => {
    this.productService.deleteProduct(productId).subscribe({
      next: (res) => {
        this.notificationService.success('Producto eliminado correctamente');
        this.deleteProductFromArray.emit(productId);
        this.activeForm.set(null);
      },
      error: (err) => {
        this.notificationService.error('Error al eliminar el producto');
        console.error('Error al eliminar producto:', err);
      },
    });
  };

  // Editar producto
  editProduct(product: Product) {
    this.activeForm.set(null);
  }

  // Registrar venta
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
          this.activeForm.set(null);
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
