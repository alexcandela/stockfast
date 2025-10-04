import { Component } from '@angular/core';
import { IngresosComponent } from './ingresos-component/ingresos-component';
import { SalesChartComponent } from './sales-chart-component/sales-chart-component';
import { TipsComponent } from './tips-component/tips-component';


@Component({
  selector: 'app-general-component',
  standalone: true,
  imports: [IngresosComponent, SalesChartComponent, TipsComponent],
  templateUrl: './general-component.html',
  styleUrl: './general-component.scss',
})
export class GeneralComponent {
  
}
