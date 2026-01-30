import { Component } from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {


  constructor(private router: Router) {
  }

  featuredApartments = [
    {
      id: 1,
      name: 'Luxury Beachside Villa',
      location: 'Miami, FL',
      price: 300,
      image: '/pics/apartment/a1.jpg'
    },
    {
      id: 2,
      name: 'Cozy Mountain Cabin',
      location: 'Aspen, CO',
      price: 200,
      image: '/pics/apartment/a2.jpg'
    },
    {
      id: 3,
      name: 'Modern City Apartment',
      location: 'New York, NY',
      price: 250,
      image: '/pics/apartment/a3.jpg'
    }
  ];

  navigateToBooking() {
    this.router.navigate(['/login'])
  }

  viewDetails(apartmentId: number) {
    console.log(`Viewing details for apartment with ID: ${apartmentId}`);
    // TODO 2:
  }

}
