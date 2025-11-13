import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Venta } from '../../core/interfaces/venta';

@Component({
  selector: 'app-venta-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-item.html',
  styleUrl: './venta-item.scss'
})
export class VentaItem {
  @Input() venta!: Venta;
  @Output() edit = new EventEmitter<Venta>();
  @Output() delete = new EventEmitter<Venta>();

  onEdit(): void {
    this.edit.emit(this.venta);
  }

  onDelete(): void {
    this.delete.emit(this.venta);
  }

  getBenefitClass(): string {
    return this.venta.benefit >= 0 ? 'positive' : 'negative';
  }
}