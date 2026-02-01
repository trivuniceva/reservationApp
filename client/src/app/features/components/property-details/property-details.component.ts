import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Apartment} from "../../../core/model/apartment.model";

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent {
  @Input() property!: Apartment;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

}
