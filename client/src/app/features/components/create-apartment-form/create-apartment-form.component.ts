import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { Apartment } from '../../../core/model/apartment.model';

@Component({
  selector: 'app-create-apartment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './create-apartment-form.component.html',
  styleUrl: './create-apartment-form.component.scss'
})
export class CreateApartmentFormComponent {
  @Output() formSubmit = new EventEmitter<Apartment>();

  apartmentData: Apartment = {
    name: '',
    description: '',
    location: '',
    amenities: [],
    images: [],
    minGuests: null as any,
    maxGuests: null as any,
    type: 'Studio',
    price: null as any,
    availableFrom: new Date(),
    availableTo: new Date(),
    autoConfirm: false,
    status: 'PENDING'
  };

  availableAmenities = ['WiFi', 'Kitchen', 'AC', 'Free Parking', 'Pool', 'TV'];
  apartmentTypes = ['Studio', 'Room', 'Entire House', 'Apartment'];

  toggleAmenity(amenity: string) {
    const index = this.apartmentData.amenities.indexOf(amenity);
    if (index > -1) {
      this.apartmentData.amenities.splice(index, 1);
    } else {
      this.apartmentData.amenities.push(amenity);
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.apartmentData.images.push(e.target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.apartmentData.images.splice(index, 1);
  }

  onSubmit() {
    this.formSubmit.emit(this.apartmentData);
  }

}
