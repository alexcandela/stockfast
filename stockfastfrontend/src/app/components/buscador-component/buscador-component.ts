import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscador-component',
  imports: [],
  templateUrl: './buscador-component.html',
  styleUrl: './buscador-component.scss',
})
export class BuscadorComponent {
  @Output() search = new EventEmitter<string>();

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // console.log(value);

    this.search.emit(value);
  }
}
