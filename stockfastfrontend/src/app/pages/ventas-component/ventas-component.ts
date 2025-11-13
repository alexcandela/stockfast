import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaItem } from '../../components/venta-item/venta-item';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';

interface Venta {
  id: number;
  product: {
    name: string;
    category: string;
  };
  sale_date: Date;
  purchase_price: number;
  sale_price: number;
  benefit: number;
  benefitPercent: number;
  selected?: boolean;
}

interface Metrics {
  totalVentas: number;
  ingresosTotales: number;
  beneficioNeto: number;
  roi: number;
  ventasChange: number;
}

@Component({
  selector: 'app-ventas-component',
  standalone: true,
  imports: [CommonModule, VentaItem, BuscadorComponent],
  templateUrl: './ventas-component.html',
  styleUrl: './ventas-component.scss'
})
export class VentasComponent implements OnInit {
  
  ventas = signal<Venta[]>([]);
  filteredVentas = signal<Venta[]>([]);
  metrics = signal<Metrics>({
    totalVentas: 0,
    ingresosTotales: 0,
    beneficioNeto: 0,
    roi: 0,
    ventasChange: 0
  });

  ngOnInit(): void {
    this.loadVentas();
    this.calculateMetrics();
  }

  loadVentas(): void {
    // Mock data - reemplazar con tu servicio
    const mockVentas: Venta[] = [
      {
        id: 1,
        product: {
          name: 'Chaqueta Vaquera Levis',
          category: 'Ropa'
        },
        sale_date: new Date('2025-11-08'),
        purchase_price: 25,
        sale_price: 45,
        benefit: 20,
        benefitPercent: 80
      },
      {
        id: 2,
        product: {
          name: 'Zapatillas Nike Air Max',
          category: 'Calzado'
        },
        sale_date: new Date('2025-11-07'),
        purchase_price: 60,
        sale_price: 95,
        benefit: 35,
        benefitPercent: 58.3
      },
      {
        id: 3,
        product: {
          name: 'iPhone 12 Pro',
          category: 'Electrónica'
        },
        sale_date: new Date('2025-11-06'),
        purchase_price: 450,
        sale_price: 580,
        benefit: 130,
        benefitPercent: 28.9
      }
    ];

    this.ventas.set(mockVentas);
    this.filteredVentas.set(mockVentas);
  }

  calculateMetrics(): void {
    const ventas = this.ventas();
    
    const totalVentas = ventas.length;
    const ingresosTotales = ventas.reduce((sum, v) => sum + v.sale_price, 0);
    const beneficioNeto = ventas.reduce((sum, v) => sum + v.benefit, 0);
    const totalInversion = ventas.reduce((sum, v) => sum + v.purchase_price, 0);
    const roi = totalInversion > 0 ? (beneficioNeto / totalInversion) * 100 : 0;

    this.metrics.set({
      totalVentas,
      ingresosTotales: Number(ingresosTotales.toFixed(2)),
      beneficioNeto: Number(beneficioNeto.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      ventasChange: 12.5
    });
  }

  getBusqueda(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredVentas.set(this.ventas());
      return;
    }

    const filtered = this.ventas().filter(venta =>
      venta.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredVentas.set(filtered);
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Filter changed:', value);
    // Implementar lógica de filtrado
  }

  selectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ventas = this.filteredVentas();
    ventas.forEach(v => v.selected = checked);
    this.filteredVentas.set([...ventas]);
  }

  editVenta(venta: Venta): void {
    console.log('Edit venta:', venta);
    // Implementar modal de edición
  }

  deleteVenta(venta: Venta): void {
    const confirmed = confirm(`¿Eliminar venta de ${venta.product.name}?`);
    
    if (confirmed) {
      const ventas = this.ventas().filter(v => v.id !== venta.id);
      this.ventas.set(ventas);
      this.filteredVentas.set(ventas);
      this.calculateMetrics();
    }
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }
}
