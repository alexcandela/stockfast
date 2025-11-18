import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Venta } from '../../core/interfaces/venta';
import { CustomValidators } from '../../core/validators/custom-validators';
import { SaleService } from '../../core/services/sale-service';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-venta-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './venta-item.html',
  styleUrl: './venta-item.scss',
})
export class VentaItem implements OnChanges {
  @Input() venta!: Venta;
  @Output() deleteVentaFromArray = new EventEmitter<number>();
  @Output() updateVentaInArray = new EventEmitter<Venta>();

  show: WritableSignal<boolean> = signal(false);
  activeForm = signal<'edit' | 'delete' | null>(null);

  deleteForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private notificationService: NotificationService
  ) {
    this.deleteForm = this.fb.group({
      venta_id: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      sale_price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      sale_date: ['', [Validators.required, CustomValidators.fechaAnteriorValidator()]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] && this.venta) {
      this.loadVentaData();
    }
  }

  loadVentaData(): void {
    this.editForm.patchValue({
      sale_price: this.venta.sale_price,
      quantity: this.venta.quantity,
      sale_date: this.venta.sale_date,
    });
  }

  toggleForm(formType: 'edit' | 'delete' | null) {
    if (this.activeForm() === formType) {
      this.activeForm.set(null);
      this.show.set(false);
    } else {
      this.activeForm.set(formType);
      this.show.set(true);

      if (formType === 'edit') {
        this.loadVentaData();
      }
    }
  }

  onEdit(): void {
    this.toggleForm('edit');
  }

  onDelete(): void {
    this.toggleForm('delete');
  }

  /**
   * Eliminar una venta
   * TODO: Implementar llamada al servicio para eliminar venta
   */
  deleteVenta(ventaId: number): void {
    // TODO: Implementar la lógica de eliminación
    this.saleService.deleteSale(ventaId).subscribe({
      next: (res) => {
        this.notificationService.success('Venta eliminada correctamente');
        this.deleteVentaFromArray.emit(ventaId);
        this.activeForm.set(null);
        this.show.set(false);
      },
      error: (err) => {
        this.notificationService.error('Error al eliminar la venta');
      },
    });
    this.deleteVentaFromArray.emit(ventaId);
    this.activeForm.set(null);
    this.show.set(false);
  }

  /**
   * Editar una venta
   * TODO: Implementar llamada al servicio para editar venta
   */
  editSale(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    // Solo los 3 campos que se envían al backend
    const updateData = {
      sale_price: this.editForm.value.sale_price,
      quantity: this.editForm.value.quantity,
      sale_date: this.editForm.value.sale_date,
    };

    // TODO: Implementar la lógica de edición
    this.saleService.updateSale(this.venta.id!, updateData).subscribe({
      next: (res) => {
        this.notificationService.success('Venta actualizada correctamente');
        // El backend devuelve la venta completa con beneficios recalculados
        this.updateVentaInArray.emit(res.venta);
        this.activeForm.set(null);
        this.show.set(false);

        // Calcular la venta actualizada con beneficios para actualización visual inmediata
        const updatedVenta = this.recalculateVenta(updateData);
        this.updateVentaInArray.emit(updatedVenta);
      },
      error: (err) => {
        if (err.error?.type === 'insufficient_stock') {
          this.editForm.get('quantity')?.markAsTouched();
          this.notificationService.error(err.error?.message || 'Error al actualizar la venta');
        } else {
          this.notificationService.error('Error al actualizar la venta');
        }

        console.error('Error al actualizar venta:', err);
      },
    });
  }

  /**
   * Recalcular beneficios y totales para actualización visual
   * Esto es temporal para la vista - el backend hará el cálculo definitivo
   */
  /**
   * Recalcular beneficios para actualización visual
   */
  private recalculateVenta(updateData: any): Venta {
    const newSalePrice = parseFloat(updateData.sale_price);
    const newQuantity = parseInt(updateData.quantity);

    // Total de venta
    const totalSalePrice = newSalePrice * newQuantity;

    // Precio de compra total
    const totalPurchasePrice = this.venta.product.purchase_price * newQuantity;

    // Gastos de envío existentes (ya calculados para esta venta)
    const shippingCost = this.venta.shipping_cost || 0;

    // Beneficio = Precio de venta - (Precio de compra + Gastos de envío)
    const benefit = totalSalePrice - (totalPurchasePrice + shippingCost);

    // Porcentaje de beneficio
    const totalCost = totalPurchasePrice + shippingCost;
    const benefitPercent = totalCost > 0 ? (benefit / totalCost) * 100 : 0;

    // Devolver venta actualizada
    return {
      ...this.venta,
      sale_price: newSalePrice,
      quantity: newQuantity,
      sale_date: updateData.sale_date,
      benefit: parseFloat(benefit.toFixed(2)),
      benefitPercent: parseFloat(benefitPercent.toFixed(2)),
    };
  }

  getBenefitClass(): string {
    return this.venta.benefit >= 0 ? 'positive' : 'negative';
  }

  /**
   * Helper: Marcar todos los campos como touched
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
