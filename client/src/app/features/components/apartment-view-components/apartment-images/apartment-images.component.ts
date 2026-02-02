import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-apartment-images',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './apartment-images.component.html',
  styleUrl: './apartment-images.component.scss'
})
export class ApartmentImagesComponent implements OnInit{
  @Input() images: string[] = [];

  activeImage: string = '';

  ngOnInit() {
    if (this.images.length > 0) {
      this.activeImage = this.images[0];
    }
  }

  selectImage(img: string) {
    this.activeImage = img;
  }
}
