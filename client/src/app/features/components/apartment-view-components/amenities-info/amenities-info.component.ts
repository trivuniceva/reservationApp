import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-amenities-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './amenities-info.component.html',
  styleUrl: './amenities-info.component.css'
})
export class AmenitiesInfoComponent {
  @Input() amenities: string[] = [];
}
