import { Component } from '@angular/core';
import { BuscadorComponent } from '../../components/buscador-component/buscador-component';
import { ProductlistComponent } from '../../components/productlist-component/productlist-component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-stock-component',
  imports: [BuscadorComponent, ProductlistComponent, CommonModule],
  templateUrl: './stock-component.html',
  styleUrl: './stock-component.scss'
})
export class StockComponent {
  
}
