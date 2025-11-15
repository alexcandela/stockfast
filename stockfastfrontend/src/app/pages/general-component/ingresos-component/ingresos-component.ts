import { Component, Output, EventEmitter, Input, OnInit, signal, computed, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
export class IngresosComponent implements OnInit, OnChanges {
  @Output() filterChange = new EventEmitter<string>();
  @Input() ingresos: Ingresos | null = null;
  @Input() numVentas: NumVentas | null = null;
  @Input() initialFilter: string = '';

  readonly Math = Math;
  
  userplan = signal<string | null>(null);
  selectedMonth = signal<string>('');
  selectedYear = signal<string>('');
  showMonthDropdown = signal(false);
  showYearDropdown = signal(false);
  selectedTotal = false;
  
  private isInitializing = true;
  
  selectedMonthLabel = computed(() => {
    if (!this.selectedMonth()) {
      this.selectedTotal = true;
      return 'Total';
    }
    const month = this.months.find(m => m.value === this.selectedMonth());
    this.selectedTotal = false;
    return month?.label ?? 'Selecciona mes';
  });
  
  selectedYearLabel = computed(() => {
    if (!this.selectedYear()) {
      return 'Total';
    }
    return this.selectedYear();
  });
  
  months: MonthOption[] = [];
  years: number[] = [];

  constructor(
    private authService: Authservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeUserPlan();
    this.initializeMonths();
    this.initializeYears();
    
    Promise.resolve().then(() => {
      this.applyInitialFilter();
      
      setTimeout(() => {
        this.isInitializing = false;
      }, 200);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilter'] && !changes['initialFilter'].firstChange) {
      this.applyInitialFilter();
    }
  }

  private applyInitialFilter(): void {
    if (this.initialFilter === 'total') {
      this.selectedMonth.set('');
      this.selectedYear.set('');
      this.cdr.detectChanges();
      return;
    }
    
    if (this.initialFilter && this.initialFilter.includes('-')) {
      const [year, month] = this.initialFilter.split('-');
      
      if (year && month) {
        setTimeout(() => {
          this.selectedYear.set(year);
          this.selectedMonth.set(month);
          this.cdr.detectChanges();
        }, 0);
        return;
      }
    }
    
    this.setInitialSelection();
  }

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
    
    if (!this.initialFilter) {
      this.emitFilter();
    }
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private emitFilter(): void {
    if (this.isInitializing) {
      return;
    }
    
    const hasMonth = this.selectedMonth();
    const hasYear = this.selectedYear();
    
    let filter: string;
    
    if (!hasMonth || !hasYear) {
      filter = 'total';
    } else {
      filter = `${hasYear}-${hasMonth}`;
    }
    
    this.filterChange.emit(filter);
  }

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
    
    if (!this.selectedYear()) {
      const currentYear = new Date().getFullYear().toString();
      this.selectedYear.set(currentYear);
    }
    
    this.showMonthDropdown.set(false);
    this.emitFilter();
  }

  selectYear(year: number): void {
    this.selectedYear.set(year.toString());
    
    if (!this.selectedMonth()) {
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      this.selectedMonth.set(currentMonth);
    }
    
    this.showYearDropdown.set(false);
    this.emitFilter();
  }

  selectTotal(): void {
    this.selectedMonth.set('');
    this.selectedYear.set('');
    
    this.showMonthDropdown.set(false);
    this.showYearDropdown.set(false);
    this.emitFilter();
  }
}