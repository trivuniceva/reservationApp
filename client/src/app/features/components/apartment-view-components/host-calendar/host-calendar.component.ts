import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Apartment } from '../../../../core/model/apartment.model';
import { SpecialPriceService } from "../../../../core/service/specialPrices/special-price.service";

@Component({
  selector: 'app-host-calendar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './host-calendar.component.html',
  styleUrls: ['./host-calendar.component.scss']
})
export class HostCalendarComponent implements OnInit, OnChanges {
  @Input() apartment!: Apartment;
  @Input() mode: 'availability' | 'pricing' = 'availability';
  @Input() userRole: string = 'GUEST';

  @Output() pricingDatesSelected = new EventEmitter<Date[]>();

  currentMonth: Date = new Date();
  datesInMonth: Date[] = [];

  unavailableDates: Date[] = [];
  reservedDates: Date[] = [];
  selectedPricingDates: Date[] = [];

  constructor(private specialPriceService: SpecialPriceService) {}

  ngOnInit() {
    this.currentMonth.setHours(12, 0, 0, 0);
    this.generateCalendar();
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.selectedPricingDates = [];
      this.pricingDatesSelected.emit([]);
    }
  }

  loadInitialData() {
    if (this.apartment && this.apartment.id) {
      this.loadReservedDates();
      this.loadUnavailableDates();
    }
  }

  generateCalendar() {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1, 12, 0, 0);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0, 12, 0, 0);
    this.datesInMonth = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.datesInMonth.push(new Date(d));
    }
  }

  changeMonth(offset: number) {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + offset));
    this.currentMonth.setHours(12, 0, 0, 0);
    this.generateCalendar();
  }

  public refreshCalendar() {
    this.loadReservedDates();
    this.loadUnavailableDates();
  }

  loadReservedDates() {
    this.specialPriceService.getReservedDatesByApartmentId(this.apartment.id!).subscribe(data => {
      this.reservedDates = data.map((d: any) => {
        const date = new Date(d);
        date.setHours(12, 0, 0, 0);
        return date;
      });
      this.generateCalendar();
    });
  }

  loadUnavailableDates() {
    if (this.apartment.availability) {
      const dates: Date[] = [];
      this.apartment.availability.forEach(interval => {
        let start = new Date(interval.startDate);
        let end = new Date(interval.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const date = new Date(d);
          date.setHours(12, 0, 0, 0);
          dates.push(date);
        }
      });
      this.unavailableDates = dates;
    }
  }

  toggleDateSelection(date: Date) {
    if (this.isReserved(date)) return;

    if (this.userRole === 'GUEST' && this.isUnavailable(date)) return;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);

    if (this.mode === 'availability') {
      this.handleAvailability(normalizedDate);
    } else {
      this.handlePricing(normalizedDate);
    }
  }

  handleAvailability(date: Date) {
    const index = this.unavailableDates.findIndex(d => this.isSameDay(d, date));
    if (index === -1) {
      this.unavailableDates.push(date);
    } else {
      this.unavailableDates.splice(index, 1);
    }
    this.sendAvailabilityToBackend();
  }

  handlePricing(date: Date) {
    const index = this.selectedPricingDates.findIndex(d => this.isSameDay(d, date));
    if (index === -1) {
      this.selectedPricingDates.push(date);
    } else {
      this.selectedPricingDates.splice(index, 1);
    }
    this.pricingDatesSelected.emit([...this.selectedPricingDates]);
  }

  sendAvailabilityToBackend() {
    const intervals = this.convertToIntervals(this.unavailableDates);
    this.specialPriceService.updateAvailability(this.apartment.id!, intervals).subscribe({
      next: () => this.apartment.availability = intervals
    });
  }

  private convertToIntervals(dates: Date[]) {
    if (dates.length === 0) return [];
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const intervals = [];
    let start = sorted[0];
    let end = sorted[0];
    for (let i = 1; i <= sorted.length; i++) {
      const next = sorted[i];
      const diff = next ? Math.round((next.getTime() - end.getTime()) / (1000 * 3600 * 24)) : null;
      if (diff === 1) {
        end = next;
      } else {
        intervals.push({ startDate: new Date(start), endDate: new Date(end) });
        if (next) { start = next; end = next; }
      }
    }
    return intervals;
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  isReserved = (date: Date): boolean => this.reservedDates.some(rd => this.isSameDay(rd, date));
  isUnavailable = (date: Date): boolean => this.unavailableDates.some(d => this.isSameDay(d, date)) && !this.isReserved(date);
  isPricingSelected = (date: Date): boolean => this.selectedPricingDates.some(d => this.isSameDay(d, date));

  isSelected(date: Date): boolean {
    if (this.mode === 'availability') return this.isUnavailable(date);
    if (this.mode === 'pricing') return this.isPricingSelected(date);
    return false;
  }

  getPriceForDate(date: Date): number {
    const special = this.apartment.specialPrices?.find(sp => {
      const s = new Date(sp.startDate); s.setHours(0,0,0,0);
      const e = new Date(sp.endDate); e.setHours(23,59,59,999);
      return date >= s && date <= e;
    });
    return special ? special.price : this.apartment.price;
  }
}
