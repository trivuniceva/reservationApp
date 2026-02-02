import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Apartment} from "../../../core/model/apartment.model";
import {AuthService} from "../../../core/service/auth/auth.service";
import {ApartmentDetailsComponent} from "../apartment-view-components/apartment-details/apartment-details.component";
import {ApartmentInfoComponent} from "../apartment-view-components/apartment-info/apartment-info.component";
import {AmenitiesInfoComponent} from "../apartment-view-components/amenities-info/amenities-info.component";
import {MapSectionComponent} from "../apartment-view-components/map-section/map-section.component";
import {ApartmentImagesComponent} from "../apartment-view-components/apartment-images/apartment-images.component";
import {FormsModule} from "@angular/forms";
import {PropertiesService} from "../../../core/service/properties/properties.service";

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
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent {
  @Input() property!: Apartment;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  userRole: string = '';
  isEditMode: boolean = false;
  editableProperty!: Apartment;
  newImageUrl: string = '';

  constructor(
    private authService: AuthService,
    private propertiesService: PropertiesService,
    ) {}

  ngOnInit() {
    const user = this.authService.getUserInfo();
    this.userRole = user ? user.role : 'GUEST';
    this.editableProperty = JSON.parse(JSON.stringify(this.property));
  }

  onClose() {
    this.close.emit();
  }

  reserve() {
    console.log('Rezervacija za:', this.property.name);
  }

  edit() {
    console.log('Editovanje:', this.property.id);
  }

  addImage() {
    if (this.newImageUrl.trim()) {
      this.editableProperty.images.push(this.newImageUrl.trim());
      this.newImageUrl = '';
    }
  }

  removeImage(index: number) {
    this.editableProperty.images.splice(index, 1);
  }

  toggleAmenity(amenity: string) {
    const index = this.editableProperty.amenities.indexOf(amenity);
    if (index > -1) {
      this.editableProperty.amenities.splice(index, 1);
    } else {
      this.editableProperty.amenities.push(amenity);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    this.propertiesService.updateProperty(this.editableProperty.id, this.editableProperty).subscribe({
      next: () => {
        this.isEditMode = false;
        this.updated.emit();
        this.property = { ...this.editableProperty };
      },
      error: (err) => console.error("Greška pri čuvanju:", err)
    });
  }

}
