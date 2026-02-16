import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-apartment-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './apartment-info.component.html',
  styleUrl: './apartment-info.component.css'
})
export class ApartmentInfoComponent {
  @Input() property: any;

}
