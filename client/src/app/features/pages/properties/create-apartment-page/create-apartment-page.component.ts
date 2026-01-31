import { Component } from '@angular/core';
import {CreateApartmentFormComponent} from "../../../components/create-apartment-form/create-apartment-form.component";
import {Apartment} from "../../../../core/model/apartment.model";
import {PropertiesService} from "../../../../core/service/properties/properties.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/service/auth/auth.service";

@Component({
  selector: 'app-create-apartment-page',
  standalone: true,
  imports: [
    CreateApartmentFormComponent
  ],
  templateUrl: './create-apartment-page.component.html',
  styleUrl: './create-apartment-page.component.css'
})
export class CreateApartmentPageComponent {

  constructor(
    private propertiesService: PropertiesService,
    private authService: AuthService,
    private router: Router
  ) {}

  handleCreate(apartment: Apartment) {
    const currentUser = this.authService.getUserInfo();

    if (!currentUser || !currentUser.id) {
      alert('You must be logged in to create a property.');
      return;
    }

    const payload: Apartment = {
      ...apartment,
      ownerId: currentUser.id
    };

    this.propertiesService.createProperty(payload).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Apartment created! It will be visible once an admin approves it.');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error creating apartment:', err);
        alert('Failed to create apartment. Please check your data.');
      }
    });
  }
}
