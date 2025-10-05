import { Component, ViewChild } from '@angular/core';
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
};

@Component({
  selector: 'app-tips-component',
  imports: [NgApexchartsModule],
  templateUrl: './tips-component.html',
  styleUrl: './tips-component.scss',
})
export class TipsComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [132, 56, 389],
      chart: {
        height: '100%',
        type: 'pie',
        
      },
      labels: ['Productos', 'Envío', 'Beneficio'],
      dataLabels: {
        enabled: true,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
