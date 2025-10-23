import { Component, Input, OnInit } from '@angular/core';
import { StockService } from '../../../core/services/stock-service';
import { Stock, StockResponse } from '../../../core/interfaces/stock';

@Component({
  selector: 'app-tips-component',
  imports: [],
  templateUrl: './tips-component.html',
  styleUrl: './tips-component.scss',
})
export class TipsComponent {
  @Input() stockTotal: number | null = null;
  @Input() stockData: Stock | null = null;

  constructor() {};

  
}
