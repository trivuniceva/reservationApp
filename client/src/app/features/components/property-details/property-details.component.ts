import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Apartment} from "../../../core/model/apartment.model";
import {AuthService} from "../../../core/service/auth/auth.service";
import {ApartmentDetailsComponent} from "../apartment-view-components/apartment-details/apartment-details.component";
import {ApartmentInfoComponent} from "../apartment-view-components/apartment-info/apartment-info.component";
import {AmenitiesInfoComponent} from "../apartment-view-components/amenities-info/amenities-info.component";
import {MapSectionComponent} from "../apartment-view-components/map-section/map-section.component";
import {ApartmentImagesComponent} from "../apartment-view-components/apartment-images/apartment-images.component";

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
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

  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUserInfo();
    this.userRole = user ? user.role : 'GUEST';
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

}
