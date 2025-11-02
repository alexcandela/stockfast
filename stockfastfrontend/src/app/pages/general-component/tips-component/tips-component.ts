import { Component, Input, OnInit } from '@angular/core';
import { StockService } from '../../../core/services/stock-service';
import { Stock, StockResponse } from '../../../core/interfaces/stock';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tips-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tips-component.html',
  styleUrl: './tips-component.scss',
})
export class TipsComponent {
  @Input() stockTotal: number | null = null;
  @Input() stockData: Stock | null = null;

  constructor() {}

  isLargeNumber(value: number | undefined): boolean {
    if (value == null) return false; // Verifica undefined y null
    const numberString = value.toFixed(2);
    return numberString.length > 7;
  }

  isStockLargeNumber(value: number | null | undefined): boolean {
    if (value == null) return false; // Verifica undefined y null
    const numberString = value.toString();
    console.log(numberString);
    
    return numberString.length > 3;
  }
}
