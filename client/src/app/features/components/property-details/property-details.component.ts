import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Apartment } from "../../../core/model/apartment.model";
import { AuthService } from "../../../core/service/auth/auth.service";
import { PropertiesService } from "../../../core/service/properties/properties.service";
import { ApartmentDetailsComponent } from "../apartment-view-components/apartment-details/apartment-details.component";
import { ApartmentInfoComponent } from "../apartment-view-components/apartment-info/apartment-info.component";
import { AmenitiesInfoComponent } from "../apartment-view-components/amenities-info/amenities-info.component";
import { MapSectionComponent } from "../apartment-view-components/map-section/map-section.component";
import { ApartmentImagesComponent } from "../apartment-view-components/apartment-images/apartment-images.component";
import { PropertyManagementComponent } from "../apartment-view-components/property-management/property-management.component";
import { HostCalendarComponent } from "../apartment-view-components/host-calendar/host-calendar.component";
import {ReservationsService} from "../../../core/service/reservations/reservations.service";

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MapSectionComponent,
    AmenitiesInfoComponent,
    ApartmentInfoComponent,
    ApartmentImagesComponent,
    ApartmentDetailsComponent,
    PropertyManagementComponent,
    HostCalendarComponent
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent implements OnInit {
  @Input() property!: Apartment;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @ViewChild(PropertyManagementComponent) managementComp!: PropertyManagementComponent;

  user: any = null;
  userRole: string = '';
  isEditMode: boolean = false;
  editableProperty!: Apartment;
  showManagement: boolean = false;

  showReservationFlow: boolean = false;
  numGuests: number = 1;
  selectedReservationDates: Date[] = [];
  fullPrice: number = 0;
  guestError: string = '';

  constructor(
    private authService: AuthService,
    private propertiesService: PropertiesService,
    private reservationsService: ReservationsService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.userRole = this.user ? this.user.role : 'GUEST';
    this.editableProperty = JSON.parse(JSON.stringify(this.property));
    this.numGuests = this.property.minGuests || 1;
  }

  onClose() {
    this.close.emit();
  }

  reserve() {
    this.showReservationFlow = true;
  }

  cancelReservationFlow() {
    this.showReservationFlow = false;
    this.selectedReservationDates = [];
    this.fullPrice = 0;
  }

  increaseGuests() {
    if (this.numGuests < this.property.maxGuests) {
      this.numGuests++;
      this.calculateTotalPrice();
    }
  }

  decreaseGuests() {
    if (this.numGuests > this.property.minGuests) {
      this.numGuests--;
      this.calculateTotalPrice();
    }
  }

  onDatesSelected(dates: Date[]) {
    this.selectedReservationDates = dates;
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    let total = 0;
    this.selectedReservationDates.forEach(date => {
      const dayPrice = this.getPriceForDate(date);
      if (this.property.pricingStrategy === 'PER_GUEST') {
        total += dayPrice * this.numGuests;
      } else {
        total += dayPrice;
      }
    });
    this.fullPrice = total;
  }

  getPriceForDate(date: Date): number {
    const special = this.property.specialPrices?.find(sp => {
      const s = new Date(sp.startDate); s.setHours(0,0,0,0);
      const e = new Date(sp.endDate); e.setHours(23,59,59,999);
      return date >= s && date <= e;
    });
    return special ? special.price : this.property.price;
  }

  confirmReservation() {
    if (this.selectedReservationDates.length === 0) {
      alert("Molimo izaberite datume!");
      return;
    }

    const sortedDates = [...this.selectedReservationDates].sort((a, b) => a.getTime() - b.getTime());

    const formatDate = (date: Date) => {
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return d.toISOString().split('T')[0];
    };

    const reservationData = {
      property: { id: this.property.id },
      guestId: this.user.id,
      reservedDates: sortedDates.map(d => formatDate(d)),
      startDate: formatDate(sortedDates[0]),
      endDate: formatDate(sortedDates[sortedDates.length - 1]),
      numberOfGuests: this.numGuests,
      totalPrice: this.fullPrice,
      status: 'PENDING'
    };

    this.reservationsService.createReservation(reservationData).subscribe({
      next: (response) => {
        alert("Zahtev za rezervaciju je uspešno poslat!");
        this.onClose();
      },
      error: (err) => {
        alert("Greška prilikom rezervacije: " + (err.error?.message || "Termin je možda zauzet."));
        console.error(err);
      }
    });
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editableProperty = JSON.parse(JSON.stringify(this.property));
    }
  }

  toggleAmenity(amenity: string) {
    if (!this.editableProperty.amenities) this.editableProperty.amenities = [];
    const index = this.editableProperty.amenities.indexOf(amenity);
    if (index > -1) this.editableProperty.amenities.splice(index, 1);
    else this.editableProperty.amenities.push(amenity);
  }

  saveChanges() {
    if (this.showManagement && this.managementComp) {
      if (this.managementComp.view === 'pricing') this.managementComp.saveNewPrice();
      else if (this.managementComp.view === 'availability') this.managementComp.saveAvailability();
      else this.managementComp.saveGeneralSettings();
    } else {
      this.propertiesService.updateProperty(this.editableProperty.id, this.editableProperty).subscribe({
        next: () => {
          this.isEditMode = false;
          this.property = JSON.parse(JSON.stringify(this.editableProperty));
          this.updated.emit();
        }
      });
    }
  }
}
