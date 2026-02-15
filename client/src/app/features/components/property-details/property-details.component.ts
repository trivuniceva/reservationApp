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
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent implements OnInit {
  @Input() property!: Apartment;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  @ViewChild(PropertyManagementComponent) managementComp!: PropertyManagementComponent;

  userRole: string = '';
  isEditMode: boolean = false;
  editableProperty!: Apartment;
  newImageUrl: string = '';
  showManagement: boolean = false;

  constructor(
    private authService: AuthService,
    private propertiesService: PropertiesService,
  ) {}

  ngOnInit() {
    const user = this.authService.getUserInfo();
    this.userRole = user ? user.role : 'GUEST';
    // Pravimo kopiju da ne bismo menjali originalni objekat dok ne kliknemo Save
    this.editableProperty = JSON.parse(JSON.stringify(this.property));
  }

  onClose() {
    this.close.emit();
  }

  // OVA METODA JE NEDOSTAJALA:
  reserve() {
    console.log('Rezervacija pokrenuta za:', this.editableProperty.name);
    // Ovde kasnije dodaj navigaciju ili otvaranje forme za rezervaciju
    alert('Funkcionalnost rezervacije će biti dostupna uskoro!');
  }

  toggleManagement() {
    this.showManagement = !this.showManagement;
    this.isEditMode = false; // Isključujemo edit mode ako prelazimo na management
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Ako otkazujemo, resetujemo editableProperty na trenutno stanje originala
      this.editableProperty = JSON.parse(JSON.stringify(this.property));
    }
  }

  toggleAmenity(amenity: string) {
    if (!this.editableProperty.amenities) {
      this.editableProperty.amenities = [];
    }
    const index = this.editableProperty.amenities.indexOf(amenity);
    if (index > -1) {
      this.editableProperty.amenities.splice(index, 1);
    } else {
      this.editableProperty.amenities.push(amenity);
    }
  }

  saveChanges() {
    if (this.showManagement && this.managementComp) {
      if (this.managementComp.view === 'pricing') {
        this.managementComp.saveNewPrice();
      } else if (this.managementComp.view === 'availability') {
        this.managementComp.saveAvailability();
      } else {
        this.managementComp.saveGeneralSettings();
      }
    } else {
      this.propertiesService.updateProperty(this.editableProperty.id, this.editableProperty).subscribe({
        next: () => {
          this.isEditMode = false;
          this.property = JSON.parse(JSON.stringify(this.editableProperty));
          this.updated.emit();
          alert("Promene na osnovnim informacijama sačuvane!");
        },
        error: (err) => {
          console.error("Greška pri čuvanju:", err);
          alert("Greška prilikom čuvanja promena.");
        }
      });
    }
  }
}
