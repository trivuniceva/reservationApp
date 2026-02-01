import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Apartment } from "../../../../core/model/apartment.model";
import { PropertiesService } from "../../../../core/service/properties/properties.service";
import { AuthService } from "../../../../core/service/auth/auth.service";
import {PropertyDetailsComponent} from "../../../components/property-details/property-details.component";

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [
    CommonModule,
    PropertyDetailsComponent
  ],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.scss'
})
export class PropertiesPageComponent implements OnInit {
  userProperties: Apartment[] = [];
  isLoading: boolean = true;
  selectedProperty: Apartment | null = null;

  constructor(
    private propertiesService: PropertiesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyProperties();
  }

  loadMyProperties(): void {
    const user = this.authService.getUserInfo();
    if (user && user.id) {
      this.propertiesService.getPropertiesByOwner(user.id).subscribe({
        next: (data) => {
          this.userProperties = data;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
  }

  openDetails(prop: Apartment) {
    this.selectedProperty = prop;
    document.body.style.overflow = 'hidden';
  }

  closeDetails() {
    this.selectedProperty = null;
    document.body.style.overflow = 'auto';
  }
}
