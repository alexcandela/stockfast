import { Component, Output, EventEmitter, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../../../core/services/authservice';
import { Ingresos } from '../../../core/interfaces/generaldata';
import { NumVentas } from '../../../core/interfaces/num-ventas';

interface MonthOption {
  value: string;
  label: string;
  locked: boolean;
}

@Component({
  selector: 'app-ingresos-component',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './ingresos-component.html',
  styleUrls: ['./ingresos-component.scss'],
})
export class IngresosComponent {
  @Output() filterChange = new EventEmitter<string>();
  @Input() ingresos: Ingresos | null = null;
  @Input() numVentas: NumVentas | null = null;

  readonly Math = Math;
  
  userplan = signal<string | null>(null);
  selectedMonth = signal<string>('');
  selectedYear = signal<string>('');
  showMonthDropdown = signal(false);
  showYearDropdown = signal(false);
  
  // Computed signals
  selectedMonthLabel = computed(() => {
    const month = this.months.find(m => m.value === this.selectedMonth());
    return month?.label ?? '';
  });
  
  selectedYearLabel = computed(() => this.selectedYear());
  
  months: MonthOption[] = [];
  years: number[] = [];

  constructor(private authService: Authservice) {
    this.initializeUserPlan();
    this.initializeMonths();
    this.initializeYears();
    this.setInitialSelection();
  }

  // ==================== INICIALIZACIÓN ====================
  
  private initializeUserPlan(): void {
    this.userplan.set(this.authService.getUserPlan());
  }

  private initializeMonths(): void {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const previousMonth = now.getMonth() === 0 
      ? '12' 
      : now.getMonth().toString().padStart(2, '0');

    this.months = Array.from({ length: 12 }, (_, i) => {
      const value = (i + 1).toString().padStart(2, '0');
      const label = this.capitalizeFirstLetter(
        new Date(2000, i).toLocaleString('es', { month: 'long' })
      );
      
      const locked = this.isMonthLocked(value, currentMonth, previousMonth);

      return { value, label, locked };
    });
  }

  private isMonthLocked(
    monthValue: string, 
    currentMonth: string, 
    previousMonth: string
  ): boolean {
    if (this.userplan() !== 'Free') return false;
    return monthValue !== currentMonth && monthValue !== previousMonth;
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);
  }

  private setInitialSelection(): void {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = now.getFullYear().toString();

    this.selectedMonth.set(currentMonth);
    this.selectedYear.set(currentYear);
  }

  // ==================== HELPERS ====================
  
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private emitFilter(): void {
    const filter = `${this.selectedYear()}-${this.selectedMonth()}`;
    this.filterChange.emit(filter);
  }

  private emitSelectedDate(): void {
    
  }

  // ==================== ACCIONES PÚBLICAS ====================
  
  toggleMonthDropdown(): void {
    this.showMonthDropdown.update(value => !value);
    this.showYearDropdown.set(false);
  }

  toggleYearDropdown(): void {
    this.showYearDropdown.update(value => !value);
    this.showMonthDropdown.set(false);
  }

  selectMonth(month: MonthOption): void {
    if (month.locked) return;
    
    this.selectedMonth.set(month.value);
    this.showMonthDropdown.set(false);
    this.emitFilter();
  }

  selectYear(year: number): void {
    this.selectedYear.set(year.toString());
    this.showYearDropdown.set(false);
    this.emitFilter();
  }

  selectTotal(): void {
    this.showMonthDropdown.set(false);
    this.showYearDropdown.set(false);
    this.filterChange.emit('total');
  }
}