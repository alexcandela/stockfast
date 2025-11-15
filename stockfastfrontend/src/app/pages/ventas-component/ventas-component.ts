import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaItem } from '../../components/venta-item/venta-item';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';
import { Venta } from '../../core/interfaces/venta';
import { Metrics } from '../../core/interfaces/metrics';

import { NotificationService } from '../../core/services/notification-service';
import { SaleService } from '../../core/services/sale-service';

import { SkeletonComponent } from '../../components/skeleton-component/skeleton-component';

@Component({
  selector: 'app-ventas-component',
  standalone: true,
  imports: [CommonModule, VentaItem, BuscadorComponent, SkeletonComponent],
  templateUrl: './ventas-component.html',
  styleUrl: './ventas-component.scss',
})
export class VentasComponent implements OnInit {
  constructor(
    private saleService: SaleService,
    private notificationService: NotificationService
  ) {}

  loading = signal<boolean>(true);
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
          this.loading.set(false);
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

    const totalVentas = ventas.reduce((sum, v) => sum + v.quantity, 0);
    const ingresosTotales = ventas.reduce((sum, v) => sum + v.sale_price * v.quantity, 0);
    const beneficioNeto = ventas.reduce((sum, v) => sum + v.benefit, 0);

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

    const filtered = this.ventas().filter((venta) =>
      venta.product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  /**
   * Actualizar una venta en el array después de editarla
   */
  updateVentaInArray(updatedVenta: Venta): void {
    const currentVentas = this.ventas();
    const index = currentVentas.findIndex(v => v.id === updatedVenta.id);
    
    if (index !== -1) {
      const newVentas = [...currentVentas];
      newVentas[index] = { ...updatedVenta };
      this.ventas.set(newVentas);
      
      // Actualizar también filteredVentas
      const currentFiltered = this.filteredVentas();
      const filteredIndex = currentFiltered.findIndex(v => v.id === updatedVenta.id);
      if (filteredIndex !== -1) {
        const newFiltered = [...currentFiltered];
        newFiltered[filteredIndex] = { ...updatedVenta };
        this.filteredVentas.set(newFiltered);
      }
      
      this.calculateMetrics();
      console.log('Venta actualizada:', updatedVenta);
    }
  }

  /**
   * Eliminar una venta del array
   */
  removeVentaFromArray(ventaId: number): void {
    const currentVentas = this.ventas();
    const newVentas = currentVentas.filter(v => v.id !== ventaId);
    this.ventas.set(newVentas);
    
    const currentFiltered = this.filteredVentas();
    const newFiltered = currentFiltered.filter(v => v.id !== ventaId);
    this.filteredVentas.set(newFiltered);
    
    this.calculateMetrics();
    console.log('Venta eliminada:', ventaId);
  }

  // Mantener los métodos antiguos si aún los usas
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