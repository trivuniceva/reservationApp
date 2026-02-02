import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostCalendarComponent } from '../host-calendar/host-calendar.component';
import {Apartment, SpecialPrice} from "../../../../core/model/apartment.model";
import {SpecialPriceService} from "../../../../core/service/specialPrices/special-price.service";

@Component({
  selector: 'app-property-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HostCalendarComponent
  ],
  templateUrl: './property-management.component.html',
  styleUrls: ['./property-management.component.scss']
})
export class PropertyManagementComponent {
  @Input() property!: Apartment;
  view: 'availability' | 'pricing' | 'settings' = 'availability';

  pricingForm = { startDate: '', endDate: '', price: 0 };
  reservedDates: Date[] = [];

  selectedDatesFromCalendar: Date[] = [];

  constructor(private spService: SpecialPriceService) {}

  ngOnInit() {
    this.spService.getReservedDates(this.property.id!).subscribe(dates => {
      this.reservedDates = dates.map(d => new Date(d));
    });
  }

  saveNewPrice() {
    if (this.selectedDatesFromCalendar.length === 0) {
      alert('Molimo odaberite datume na kalendaru!');
      return;
    }

    const sortedDates = [...this.selectedDatesFromCalendar].sort((a, b) => a.getTime() - b.getTime());

    const ranges: SpecialPrice[] = [];
    let currentStart = sortedDates[0];
    let currentEnd = sortedDates[0];

    for (let i = 1; i <= sortedDates.length; i++) {
      const nextDate = sortedDates[i];

      const diffInTime = nextDate ? nextDate.getTime() - currentEnd.getTime() : null;
      const diffInDays = diffInTime ? diffInTime / (1000 * 3600 * 24) : null;

      if (diffInDays === 1) {
        currentEnd = nextDate;
      } else {
        ranges.push({
          startDate: new Date(currentStart),
          endDate: new Date(currentEnd),
          price: this.pricingForm.price
        });
        if (nextDate) {
          currentStart = nextDate;
          currentEnd = nextDate;
        }
      }
    }

    ranges.forEach(range => {
      this.spService.addSpecialPrice(this.property.id!, range).subscribe({
        next: () => {
          this.property.specialPrices.push(range);
        },
        error: (err) => console.error("Greška kod datuma:", range.startDate, err)
      });
    });

    alert(`Uspešno dodato ${ranges.length} pravila za cenu!`);
    this.selectedDatesFromCalendar = [];
  }

  onDatesSelected(dates: Date[]) {
    this.selectedDatesFromCalendar = dates.sort((a, b) => a.getTime() - b.getTime());

    if (this.selectedDatesFromCalendar.length > 0) {
      this.pricingForm.startDate = this.selectedDatesFromCalendar[0].toISOString().split('T')[0];
      this.pricingForm.endDate = this.selectedDatesFromCalendar[this.selectedDatesFromCalendar.length - 1].toISOString().split('T')[0];
    }
  }
}
