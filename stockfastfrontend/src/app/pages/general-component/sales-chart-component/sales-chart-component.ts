import { Component, ElementRef, ViewChild } from '@angular/core';

import {
  NgApexchartsModule,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';

import { series } from './data';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-sales-chart-component',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './sales-chart-component.html',
  styleUrl: './sales-chart-component.scss',
})
export class SalesChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Productos vendidos',
          data: series.productSales.data,
        },
      ],
      chart: {
        type: 'area',
        height: '100%',
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: { type: 'datetime' },
      yaxis: { opposite: false },
      title: { text: '', align: 'left' },
      subtitle: { text: '', align: 'left' },
      legend: { show: true, horizontalAlign: 'left' },
      labels: series.productSales.dates.map((dateStr) => new Date(dateStr).toISOString()),
    };
  }
}
