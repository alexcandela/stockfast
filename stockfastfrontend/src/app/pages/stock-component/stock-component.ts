import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';
import { ProductlistComponent } from '../../components/productlist-component/productlist-component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product-service';
import { Product } from '../../core/interfaces/product';
@Component({
  selector: 'app-stock-component',
  imports: [BuscadorComponent, ProductlistComponent, CommonModule],
  templateUrl: './stock-component.html',
  styleUrl: './stock-component.scss',
})
export class StockComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products;
          this.cd.detectChanges(); // fuerza actualización de la vista
        }
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }
}
