import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaItem } from '../../components/venta-item/venta-item';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';
import { Venta } from '../../core/interfaces/venta';
import { Metrics } from '../../core/interfaces/metrics';

import { NotificationService } from '../../core/services/notification-service';
import { SaleService } from '../../core/services/sale-service';
@Component({
  selector: 'app-ventas-component',
  standalone: true,
  imports: [CommonModule, VentaItem, BuscadorComponent],
  templateUrl: './ventas-component.html',
  styleUrl: './ventas-component.scss',
})
export class VentasComponent implements OnInit {
  constructor(private saleService: SaleService, private notificationService: NotificationService) {}

  ventas = signal<Venta[]>([]);
  filteredVentas = signal<Venta[]>([]);
  metrics = signal<Metrics>({
    totalVentas: 0,
    ingresosTotales: 0,
    beneficioNeto: 0,
    roi: 0,
    ventasChange: 0,
  });

  ngOnInit(): void {
    this.getSales();
  }

  getSales(): void {
    this.saleService.getSales().subscribe({
      next: (response) => {
        if (response.success) {
          this.ventas.set(response.data);
          this.filteredVentas.set(response.data);
          this.calculateMetrics();
        }
      },
      error: (err) => {
        this.notificationService.error('Error al obtener ventas');
        console.error('Error al obtener ventas:', err);
      },
    });
  }

  calculateMetrics(): void {
    const ventas = this.ventas();

    // ✅ Suma la cantidad total de unidades vendidas
    const totalVentas = ventas.reduce((sum, v) => sum + v.quantity, 0);

    // Ingresos totales (precio venta unitario * cantidad)
    const ingresosTotales = ventas.reduce((sum, v) => sum + v.sale_price * v.quantity, 0);

    // Beneficio neto (ya viene calculado como total desde el backend)
    const beneficioNeto = ventas.reduce((sum, v) => sum + v.benefit, 0);

    // Inversión total (costes totales)
    const totalInversion = ventas.reduce((sum, v) => {
      return sum + (v.total_purchase_price + v.total_shipping_cost);
    }, 0);

    const roi = totalInversion > 0 ? (beneficioNeto / totalInversion) * 100 : 0;

    this.metrics.set({
      totalVentas,
      ingresosTotales: Number(ingresosTotales.toFixed(2)),
      beneficioNeto: Number(beneficioNeto.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      ventasChange: 12.5,
    });
  }

  getBusqueda(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredVentas.set(this.ventas());
      return;
    }

    const filtered = this.ventas().filter(
      (venta) => venta.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      // venta.product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredVentas.set(filtered);
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Filter changed:', value);
  }

  selectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ventas = this.filteredVentas();
    ventas.forEach((v) => (v.selected = checked));
    this.filteredVentas.set([...ventas]);
  }

  editVenta(venta: Venta): void {
    console.log('Edit venta:', venta);
  }

  deleteVenta(venta: Venta): void {
    const confirmed = confirm(`¿Eliminar venta de ${venta.product.name}?`);

    if (confirmed) {
      const ventas = this.ventas().filter((v) => v.id !== venta.id);
      this.ventas.set(ventas);
      this.filteredVentas.set(ventas);
      this.calculateMetrics();
    }
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }
}
