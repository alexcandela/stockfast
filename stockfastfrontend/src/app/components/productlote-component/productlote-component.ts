import { Component, signal, WritableSignal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/interfaces/product';

@Component({
  selector: 'app-productlote-component',
  imports: [CommonModule],
  templateUrl: './productlote-component.html',
  styleUrl: './productlote-component.scss',
})
export class ProductloteComponent implements OnInit{

  @Input() producto!: Producto;
  @Output() eliminar = new EventEmitter<any>();

  show: WritableSignal<boolean> = signal(false);

  toggle() {
    this.show.set(!this.show());
    console.log(this.show());
  }

  eliminarProducto() {
    this.eliminar.emit();
  }

  ngOnInit(): void {
  }
  
}
