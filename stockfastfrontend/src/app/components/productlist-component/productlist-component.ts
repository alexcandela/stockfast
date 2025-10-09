import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productlist-component',
  imports: [CommonModule],
  templateUrl: './productlist-component.html',
  styleUrl: './productlist-component.scss'
})
export class ProductlistComponent {
  show: WritableSignal<boolean> = signal(false);

  toggle() {
    this.show.set(!this.show());
    console.log(this.show());
    
  }
}
