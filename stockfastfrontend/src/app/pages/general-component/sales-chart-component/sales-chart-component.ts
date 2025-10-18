import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
  }

  private updateChart(data: any[], filter: string) {
    if (!data || data.length === 0) {
      this.chartOptions.series = [{ name: 'Productos vendidos', data: [] }];
      this.chartOptions.labels = [];
      return;
    }

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
