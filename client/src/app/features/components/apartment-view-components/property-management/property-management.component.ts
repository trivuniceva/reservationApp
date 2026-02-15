import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostCalendarComponent } from '../host-calendar/host-calendar.component';
import { Apartment, SpecialPrice, AvailabilityInterval } from "../../../../core/model/apartment.model";
import { SpecialPriceService } from "../../../../core/service/specialPrices/special-price.service";
import { PropertiesService } from "../../../../core/service/properties/properties.service";

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
export class PropertyManagementComponent implements OnInit {
  @Input() property!: Apartment;
  view: 'availability' | 'pricing' | 'settings' = 'availability';

  pricingForm = { startDate: '', endDate: '', price: 0 };
  reservedDates: Date[] = [];
  selectedDatesFromCalendar: Date[] = [];

  constructor(
    private spService: SpecialPriceService,
    private propertiesService: PropertiesService
  ) {}

  ngOnInit() {
    this.loadReservedDates();
  }

  loadReservedDates() {
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
    if (sortedDates.length > 0) {
      let currentStart = sortedDates[0];
      let currentEnd = sortedDates[0];

      for (let i = 1; i <= sortedDates.length; i++) {
        const nextDate = sortedDates[i];
        const diffInDays = nextDate ? (nextDate.getTime() - currentEnd.getTime()) / (1000 * 3600 * 24) : null;

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
    }

    ranges.forEach(range => {
      this.spService.addSpecialPrice(this.property.id!, range).subscribe({
        next: () => {
          if (!this.property.specialPrices) this.property.specialPrices = [];
          this.property.specialPrices.push(range);
        },
        error: (err) => console.error("Greška kod čuvanja cene:", err)
      });
    });

    alert(`Uspešno postavljena cena za selektovane periode.`);
    this.selectedDatesFromCalendar = [];
  }

  saveAvailability() {
    if (this.selectedDatesFromCalendar.length === 0) return;

    const finalUnavailableDates: Date[] = [];
    const sortedDates = [...this.selectedDatesFromCalendar].sort((a, b) => a.getTime() - b.getTime());
    const intervals: AvailabilityInterval[] = [];
    let currentStart = sortedDates[0];
    let currentEnd = sortedDates[0];

    for (let i = 1; i <= sortedDates.length; i++) {
      const nextDate = sortedDates[i];
      const diffInDays = nextDate ? (nextDate.getTime() - currentEnd.getTime()) / (1000 * 3600 * 24) : null;

      if (diffInDays === 1) {
        currentEnd = nextDate;
      } else {
        intervals.push({
          startDate: new Date(currentStart),
          endDate: new Date(currentEnd)
        });
        if (nextDate) {
          currentStart = nextDate;
          currentEnd = nextDate;
        }
      }
    }

    this.spService.updateAvailability(this.property.id!, intervals).subscribe({
      next: () => {
        this.property.availability = intervals;
        alert("Dostupnost uspešno ažurirana!");
        this.selectedDatesFromCalendar = [];
      },
      error: (err) => console.error(err)
    });
  }

  saveGeneralSettings() {
    this.propertiesService.updateProperty(this.property.id, this.property).subscribe({
      next: () => alert("Pravila uspešno sačuvana!"),
      error: (err) => console.error("Greška pri čuvanju pravila:", err)
    });
  }

  onDatesSelected(dates: Date[]) {
    this.selectedDatesFromCalendar = dates;
  }
}
