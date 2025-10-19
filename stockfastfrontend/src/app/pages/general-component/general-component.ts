import {
  ChangeDetectorRef,
  Component,
  effect,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { IngresosComponent } from './ingresos-component/ingresos-component';
import { SalesChartComponent } from './sales-chart-component/sales-chart-component';
import { TipsComponent } from './tips-component/tips-component';
import { Authservice } from '../../core/services/authservice';
import { GeneralDataService } from '../../core/services/general-data-service';
import { Ingresos } from '../../core/interfaces/generaldata';
import { NumVentas } from '../../core/interfaces/num-ventas';

@Component({
  selector: 'app-general-component',
  standalone: true,
  imports: [IngresosComponent, SalesChartComponent, TipsComponent],
  templateUrl: './general-component.html',
  styleUrl: './general-component.scss',
})
export class GeneralComponent implements OnInit {
  userplan: string | null = null;
  data: any[] = [];
  ingresos: Ingresos | null = null;
  numVentas: NumVentas | null = null;
  stockTotal: number | null = null;
  filter: WritableSignal<string> = signal(this.getCurrentMonth());

  constructor(
    private authService: Authservice,
    private generalDataService: GeneralDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.userplan = this.authService.getUserPlan();
    effect(() => {
      this.loadData(this.filter());
    });
  }

  getCurrentMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  onFilterSelected(selectedFilter: string) {
    this.filter.set(selectedFilter);
    this.loadData(this.filter());
  }

  loadData(filter: string) {
    this.generalDataService.getGeneralData(filter).subscribe({
      next: (res) => {
        this.data = res.data;
        this.ingresos = res.ingresos;  
        this.numVentas = res.numeroVentas;  
        this.stockTotal = res.stockTotal;  
        console.log(this.stockTotal);
                 
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener datos:', err),
    });
  }

  getBasicData() {}

  ngOnInit(): void {
    this.loadData(this.filter());
  }
}
