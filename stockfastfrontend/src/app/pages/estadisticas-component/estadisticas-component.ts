import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

// Interfaces
export interface ProductoEnLote {
  id: number;
  name: string;
  quantity: number;
  purchase_price: number;
  estimated_sale_price: number;
}

export interface Lote {
  id: number;
  name: string;
  created_at: string;
  shipping_cost: number;
  inversion: number;
  ingresos: number;
  beneficio: number;
  roi: number;
  vendidos: number;
  total: number;
  stock: number;
  productos: ProductoEnLote[];
}

export interface ProductoResumen {
  id: number;
  name: string;
  num_lotes: number;
  vendidos: number;
  stock: number;
  beneficio: number;
  roi: number;
}

@Component({
  selector: 'app-estadisticas-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './estadisticas-component.html',
  styleUrl: './estadisticas-component.scss',
})
export class EstadisticasComponent implements OnInit {
  // ── Estado ────────────────────────────────────────
  activeTab: 'lotes' | 'productos' = 'lotes';
  searchLote = '';
  searchProducto = '';
  filterEstado: 'todos' | 'activo' | 'liquidado' = 'todos';
  sortProducto: 'beneficio' | 'ventas' | 'roi' = 'beneficio';

  loading = signal(true);
  lotes = signal<Lote[]>([]);
  productos = signal<ProductoResumen[]>([]);

  // ── Stats globales ────────────────────────────────
  totalInversion = computed(() =>
    this.lotes()
      .reduce((acc, l) => acc + l.inversion, 0)
      .toFixed(2),
  );

  totalBeneficio = computed(() =>
    this.lotes()
      .reduce((acc, l) => acc + l.beneficio, 0)
      .toFixed(2),
  );

  totalRoi = computed(() => {
    const inv = this.lotes().reduce((acc, l) => acc + l.inversion, 0);
    const ben = this.lotes().reduce((acc, l) => acc + l.beneficio, 0);
    return inv > 0 ? +((ben / inv) * 100).toFixed(2) : 0;
  });

  lotesActivos = computed(() => this.lotes().filter((l) => l.stock > 0).length);

  // ── Filtros lotes ─────────────────────────────────
  get lotesFiltrados(): Lote[] {
    return this.lotes().filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(this.searchLote.toLowerCase());
      const matchEstado =
        this.filterEstado === 'todos' ||
        (this.filterEstado === 'activo' && l.stock > 0) ||
        (this.filterEstado === 'liquidado' && l.stock === 0);
      return matchSearch && matchEstado;
    });
  }

  // ── Filtros y orden productos ─────────────────────
  get productosFiltrados(): ProductoResumen[] {
    return this.productos()
      .filter((p) => p.name.toLowerCase().includes(this.searchProducto.toLowerCase()))
      .sort((a, b) => {
        if (this.sortProducto === 'beneficio') return b.beneficio - a.beneficio;
        if (this.sortProducto === 'ventas') return b.vendidos - a.vendidos;
        if (this.sortProducto === 'roi') return b.roi - a.roi;
        return 0;
      });
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    // TODO: sustituir por llamada al servicio real
    // this.lotesService.getLotes().subscribe(res => {
    //   this.lotes.set(res.lotes);
    //   this.productos.set(res.productos);
    //   this.loading.set(false);
    // });

    // Datos de ejemplo hasta tener el endpoint
    this.lotes.set([
      {
        id: 1,
        name: 'Birkenstock Verano 2024',
        created_at: '2024-03-15',
        shipping_cost: 30,
        inversion: 450,
        ingresos: 620,
        beneficio: 170,
        roi: 37.78,
        vendidos: 14,
        total: 20,
        stock: 6,
        productos: [
          { id: 1, name: 'Talla 37', quantity: 3, purchase_price: 22, estimated_sale_price: 35 },
          { id: 2, name: 'Talla 38', quantity: 5, purchase_price: 22, estimated_sale_price: 35 },
          { id: 3, name: 'Talla 39', quantity: 8, purchase_price: 22, estimated_sale_price: 35 },
        ],
      },
      {
        id: 2,
        name: 'Nike Air Max Lote 1',
        created_at: '2024-01-10',
        shipping_cost: 50,
        inversion: 800,
        ingresos: 800,
        beneficio: 0,
        roi: 0,
        vendidos: 10,
        total: 10,
        stock: 0,
        productos: [
          { id: 4, name: 'Talla 41', quantity: 0, purchase_price: 40, estimated_sale_price: 80 },
          { id: 5, name: 'Talla 42', quantity: 0, purchase_price: 40, estimated_sale_price: 80 },
        ],
      },
    ]);

    this.productos.set([
      {
        id: 1,
        name: 'Birkenstock Talla 37',
        num_lotes: 2,
        vendidos: 18,
        stock: 3,
        beneficio: 234,
        roi: 42.5,
      },
      {
        id: 2,
        name: 'Birkenstock Talla 38',
        num_lotes: 1,
        vendidos: 10,
        stock: 5,
        beneficio: 120,
        roi: 28.3,
      },
      {
        id: 3,
        name: 'Nike Air Max Talla 41',
        num_lotes: 1,
        vendidos: 10,
        stock: 0,
        beneficio: 95,
        roi: 18.1,
      },
    ]);

    this.loading.set(false);
  }

  goToLote(id: number): void {
    this.router.navigate(['/lotes', id]);
  }

  goToProducto(id: number): void {
    this.router.navigate(['/productos', id]);
  }
}
