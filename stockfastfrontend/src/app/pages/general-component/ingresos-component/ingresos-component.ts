import { Component, Output, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../../../core/services/authservice';
import { Ingresos } from '../../../core/interfaces/generaldata';

@Component({
  selector: 'app-ingresos-component',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './ingresos-component.html',
  styleUrls: ['./ingresos-component.scss'],
})
export class IngresosComponent implements OnInit {
  @Output() filterChange = new EventEmitter<string>();
  @Input() ingresos: Ingresos | null = null;

  userplan: string | null = null;

  months: { value: string; label: string; locked: boolean }[] = [];
  years: number[] = [];

  selectedMonth: string = '';
  selectedYear: string = '';
  selectedMonthLabel: string = '';
  selectedYearLabel: string = '';

  showMonthDropdown = false;
  showYearDropdown = false;

  constructor(private authService: Authservice) {        
    this.userplan = this.authService.getUserPlan();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const previousMonth = (now.getMonth() === 0 ? 12 : now.getMonth()).toString().padStart(2, '0');

    // Crear meses (bloquear según plan)
    for (let i = 1; i <= 12; i++) {
      const value = i.toString().padStart(2, '0');
      let label = new Date(2000, i - 1).toLocaleString('es', { month: 'long' });
      label = label.charAt(0).toUpperCase() + label.slice(1);

      // Si el usuario tiene plan Free, solo puede ver el mes actual y el anterior
      const locked =
        this.userplan === 'Free' ? !(value === currentMonth || value === previousMonth) : false;

      this.months.push({ value, label, locked });
    }

    // Crear años (últimos 5)
    for (let y = currentYear - 5; y <= currentYear; y++) {
      this.years.push(y);
    }

    // Inicializar selección actual
    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear.toString();
    this.updateSelectedMonthLabel();
    this.selectedYearLabel = this.selectedYear;
  }

  private updateSelectedMonthLabel() {
    const month = this.months.find((m) => m.value === this.selectedMonth);
    this.selectedMonthLabel = month ? month.label : '';
  }

  toggleMonthDropdown() {
    this.showMonthDropdown = !this.showMonthDropdown;
  }

  toggleYearDropdown() {
    this.showYearDropdown = !this.showYearDropdown;
  }

  selectMonth(month: { value: string; locked: boolean; label: string }) {
    if (!month.locked) {
      this.selectedMonth = month.value;
      this.updateSelectedMonthLabel();
      this.showMonthDropdown = false;
      this.emitFilter();
    }
  }

  selectYear(year: number) {
    this.selectedYear = year.toString();
    this.selectedYearLabel = this.selectedYear;
    this.showYearDropdown = false;
    this.emitFilter();
  }

  selectTotal() {
    this.selectedMonthLabel = 'Total';
    this.selectedYearLabel = 'Total';
    this.showMonthDropdown = false;
    this.showYearDropdown = false;
    this.filterChange.emit('total');
  }

  private emitFilter() {
    this.filterChange.emit(`${this.selectedYear}-${this.selectedMonth}`);
  }
  

  ngOnInit() {
    console.log(this.ingresos?.margen_bruto);
    
  }
}
