import { Component } from '@angular/core';
import { IngresosComponent } from './ingresos-component/ingresos-component';


@Component({
  selector: 'app-general-component',
  standalone: true,
  imports: [IngresosComponent],
  templateUrl: './general-component.html',
  styleUrl: './general-component.scss',
})
export class GeneralComponent {
  
}
