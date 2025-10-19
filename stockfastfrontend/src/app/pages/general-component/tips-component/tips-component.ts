import { Component, Input, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-tips-component',
  imports: [NgApexchartsModule],
  templateUrl: './tips-component.html',
  styleUrl: './tips-component.scss',
})
export class TipsComponent {
  @Input() stockTotal: number | null = null;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [132, 56, 389],
      chart: { height: '100%', type: 'donut' },
      labels: ['Productos', 'Envío', 'Beneficio'],
      dataLabels: { enabled: false },
      legend: { show: false },
      tooltip: {
        y: {
          formatter: (val: number, opts: any) => {
            return `${val} €`;
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 200 }, legend: { position: 'bottom' } },
        },
      ],
    };
  }
}
