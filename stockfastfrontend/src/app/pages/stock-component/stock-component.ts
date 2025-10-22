import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';
import { ProductlistComponent } from '../../components/productlist-component/productlist-component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product-service';
import { Product } from '../../core/interfaces/product';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-stock-component',
  imports: [BuscadorComponent, ProductlistComponent, CommonModule],
  templateUrl: './stock-component.html',
  styleUrl: './stock-component.scss',
})
export class StockComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = []; // Nueva propiedad para productos filtrados

  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  removeProduct(productId: number) {
    this.products = this.products.filter((p) => p.id !== productId);
    this.filteredProducts = this.filteredProducts.filter((p) => p.id !== productId);
  }

  // Buscador async
  getBusqueda(data: string) {
    const searchTerm = data.trim();

    if (searchTerm === '') {
      this.filteredProducts = [...this.products];
    } else if (searchTerm.startsWith('#')) {
      // Filtrar por purchase_id
      const purchaseId = searchTerm.substring(1).trim(); // Quitar el # y espacios

      if (purchaseId === '') {
        // Si solo escribió # sin número, mostrar todos
        this.filteredProducts = [...this.products];
      } else {
        this.filteredProducts = this.products.filter((product) =>
          product.purchase?.id?.toString().includes(purchaseId)
        );
      }
    } else {
      // Filtrar por nombre
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products;
          this.filteredProducts = [...this.products]; // Inicializar filteredProducts
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.notificationService.error('Error al obtener productos');
        console.error('Error al obtener productos:', err);
      },
    });
  }
}
