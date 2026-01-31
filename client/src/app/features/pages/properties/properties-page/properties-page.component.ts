import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Apartment} from "../../../../core/model/apartment.model";
import {PropertiesService} from "../../../../core/service/properties/properties.service";
import {AuthService} from "../../../../core/service/auth/auth.service";

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.scss'
})
export class PropertiesPageComponent implements OnInit {
  userProperties: Apartment[] = [];
  isLoading: boolean = true;

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
        error: (err) => {
          console.error('Greška pri učitavanju smeštaja:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
