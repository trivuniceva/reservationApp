import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-apartment-details',
  standalone: true,
  imports: [],
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.css'
})
export class ApartmentDetailsComponent {
  @Input() description: string = '';

}
