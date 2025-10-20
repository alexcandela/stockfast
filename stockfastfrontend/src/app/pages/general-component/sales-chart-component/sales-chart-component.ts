import { Component, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-sales-chart-component',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './sales-chart-component.html',
  styleUrls: ['./sales-chart-component.scss'],
})
export class SalesChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() filter: string = '';
  @ViewChild('chart') chart!: ChartComponent;

  filterLabel = signal('');

   meses = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ];

  public chartOptions: any = {
    series: [{ name: 'Productos vendidos', data: [] }],
    chart: { type: 'area', height: '100%', zoom: { enabled: false } },
    xaxis: { type: 'datetime' },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    labels: [],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChart(this.data, this.filter);
    }
    this.getFilterLabelNames(this.filter);
  }

  getFilterLabelNames(data: string) {
    if (data === 'total') {
      this.filterLabel.set(data.charAt(0).toUpperCase() + data.slice(1));
    } else {
      const array = data.split('-');
      const mes = this.meses.find((m) => m.id === Number(array[1]));
      this.filterLabel.set(`${mes?.nombre}, ${array[0]}`);
    }
  }

  private updateChart(data: any[], filter: string) {
    if (!data || data.length === 0) {
      this.chartOptions.series = [{ name: 'Productos vendidos', data: [] }];
      this.chartOptions.labels = [];
      return;
    }

    this.getFilterLabelNames(filter);

    let labels: string[] = [];
    let quantities: number[] = [];

    if (filter === 'total') {
      // Agrupar por mes
      const grouped: Record<string, number> = {};
      data.forEach((sale) => {
        const month = new Date(sale.sale_date).toISOString().slice(0, 7); // "YYYY-MM"
        grouped[month] = (grouped[month] || 0) + sale.quantity;
      });

      // Ordenar meses
      labels = Object.keys(grouped).sort();
      quantities = labels.map((month) => grouped[month]);
    } else {
      // Filtrar mes específico YYYY-MM → diario
      const [year, monthStr] = filter.split('-').map(Number);
      const firstDay = new Date(year, monthStr - 1, 1);
      const lastDay = new Date(year, monthStr, 0);

      const allDays: string[] = [];
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        allDays.push(d.toISOString().split('T')[0]);
      }

      const grouped = data.reduce((acc: Record<string, number>, sale) => {
        const day = new Date(sale.sale_date).toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + sale.quantity;
        return acc;
      }, {});

      labels = allDays;
      quantities = allDays.map((day) => grouped[day] || 0);
    }

    // Actualizar gráfico
    this.chartOptions.series = [{ name: 'Productos vendidos', data: quantities }];
    this.chartOptions.labels = labels;

    if (this.chart?.updateSeries) {
      this.chart.updateSeries(this.chartOptions.series, true);
    }
  }
}
