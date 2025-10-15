import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../core/interfaces/product';

@Component({
  selector: 'app-productlist-component',
  imports: [CommonModule],
  templateUrl: './productlist-component.html',
  styleUrl: './productlist-component.scss'
})
export class ProductlistComponent implements OnInit{

  @Input() product!: Product;
  @Output() eliminar = new EventEmitter<any>();

  show: WritableSignal<boolean> = signal(false);
  

  toggle() {
    this.show.set(!this.show());
  }

  ngOnInit(): void {
    console.log(this.product);
    
  }
}
