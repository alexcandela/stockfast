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

  constructor(private productService: ProductService, private cd: ChangeDetectorRef, private notificationService: NotificationService) {}

  removeProduct(productId: number) {
  this.products = this.products.filter(p => p.id !== productId);
}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products;
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
