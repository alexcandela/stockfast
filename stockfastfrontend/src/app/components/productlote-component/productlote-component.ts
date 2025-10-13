import {
  Component,
  signal,
  WritableSignal,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/interfaces/product';

@Component({
  selector: 'app-productlote-component',
  imports: [CommonModule],
  templateUrl: './productlote-component.html',
  styleUrl: './productlote-component.scss',
})
export class ProductloteComponent implements OnInit {
  @Input() product!: Product;
  @Output() eliminar = new EventEmitter<any>();

  show: WritableSignal<boolean> = signal(false);

  categoria: WritableSignal<string> = signal('');

  categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Calzado' },
    { id: 4, nombre: 'Juguetes' },
    { id: 5, nombre: 'Accesorios' },
    { id: 6, nombre: 'Joyas' },
    { id: 7, nombre: 'Relojes' },
  ];

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  }

  toggle() {
    this.show.set(!this.show());
  }

  eliminarProducto() {
    this.eliminar.emit();
  }

  ngOnInit(): void {
    if (this.product?.category_id) {
      this.categoria.set(this.getCategoriaNombre(this.product.category_id));
    }
  }
}
