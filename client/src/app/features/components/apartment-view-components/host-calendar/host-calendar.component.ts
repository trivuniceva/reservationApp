import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Apartment } from '../../../../core/model/apartment.model';

@Component({
  selector: 'app-host-calendar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './host-calendar.component.html',
  styleUrls: ['./host-calendar.component.scss']
})
export class HostCalendarComponent implements OnInit {
  @Input() apartment!: Apartment;
  @Input() mode: 'availability' | 'pricing' = 'availability';
  @Input() reservedDates: Date[] = [];
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() selectionChanged = new EventEmitter<Date[]>();

  currentMonth: Date = new Date();
  datesInMonth: Date[] = [];
  selectedDates: Date[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    this.datesInMonth = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.datesInMonth.push(new Date(d));
    }
  }

  changeMonth(offset: number) {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + offset));
    this.generateCalendar();
  }

  toggleDateSelection(date: Date) {
    if (this.isReserved(date)) return;

    const index = this.selectedDates.findIndex(d => this.isSameDay(d, date));
    if (index === -1) {
      this.selectedDates.push(date);
    } else {
      this.selectedDates.splice(index, 1);
    }

    this.dateSelected.emit(date);
    this.selectionChanged.emit(this.selectedDates);
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  }

  isReserved = (date: Date) => this.reservedDates.some(d => this.isSameDay(d, date));

  isSelected(date: Date): boolean {
    if (this.selectedDates.some(d => this.isSameDay(d, date))) return true;

    if (this.mode === 'availability') {
      return this.apartment.availability?.some(interval =>
        this.isBetween(date, new Date(interval.startDate), new Date(interval.endDate))
      ) ?? false;
    }
    return false;
  }

  getPriceForDate(date: Date): number {
    const special = this.apartment.specialPrices?.find(sp =>
      this.isBetween(date, new Date(sp.startDate), new Date(sp.endDate))
    );
    return special ? special.price : this.apartment.price;
  }

  isBetween(date: Date, start: Date, end: Date): boolean {
    const d = new Date(date).setHours(0,0,0,0);
    const s = new Date(start).setHours(0,0,0,0);
    const e = new Date(end).setHours(0,0,0,0);
    return d >= s && d <= e;
  }
}
