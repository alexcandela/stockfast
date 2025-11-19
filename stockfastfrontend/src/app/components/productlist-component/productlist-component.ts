import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/interfaces/product';
import { Category } from '../../core/interfaces/category';
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
export class ProductlistComponent implements OnChanges {
  @Input() product!: Product;
  @Output() eliminar = new EventEmitter<any>();
  @Output() deleteProductFromArray = new EventEmitter<number>();

  show: WritableSignal<boolean> = signal(false);
  activeForm = signal<'sale' | 'edit' | 'delete' | null>(null);

  saleForm: FormGroup;
  deleteForm: FormGroup;
  editForm: FormGroup;

  // Categorias
  categories: Category[] = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa' },
    { id: 3, name: 'Calzado' },
    { id: 4, name: 'Juguetes' },
    { id: 5, name: 'Accesorios' },
    { id: 6, name: 'Joyas' },
    { id: 7, name: 'Relojes' },
  ];

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
      name: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      purchase_price: [null, [Validators.required, Validators.min(0)]],
      estimated_sale_price: [null, [Validators.required, Validators.min(0)]],
      category_id: [null, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadProductData();
    }
  }

  loadProductData(): void {
    this.editForm.patchValue({
      name: this.product.name,
      quantity: this.product.quantity,
      purchase_price: this.product.purchase_price,
      estimated_sale_price: this.product.estimated_sale_price,
      category_id: this.product.category_id,
    });
  }

  toggleForm(formType: 'sale' | 'edit' | 'delete' | null) {
    if (this.activeForm() === formType) {
      this.activeForm.set(null);
      this.show.set(false);
    } else {
      this.activeForm.set(formType);
      this.show.set(true);

      if (formType === 'edit') {
        this.loadProductData();
      }
    }
  }

  deleteProduct = (productId: number) => {
    this.productService.deleteProduct(productId).subscribe({
      next: (res) => {
        this.notificationService.success('Producto eliminado correctamente');
        this.deleteProductFromArray.emit(productId);
        this.toggleForm('delete');
        this.activeForm.set(null);
      },
      error: (err) => {
        this.notificationService.error('Error al eliminar el producto');
        console.error('Error al eliminar producto:', err);
      },
    });
  };

  editProduct(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.productService.updateProduct(this.product.id!, this.editForm.value).subscribe({
      next: (res) => {
        this.notificationService.success('Producto actualizado correctamente');
        // Actualizar el producto localmente
        const selectedCategory = this.categories.find(
          (cat) => cat.id === Number(this.editForm.get('category_id')?.value)
        );

        this.product = { ...this.product, ...this.editForm.value, category: selectedCategory! };
        this.toggleForm('edit');
        this.activeForm.set(null);
      },
      error: (err) => {
        this.notificationService.error('Error al actualizar el producto');
        console.error('Error al actualizar producto:', err);
      },
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
