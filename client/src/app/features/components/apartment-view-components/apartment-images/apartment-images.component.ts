import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";

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
  @Input() isEditMode: boolean = false;
  @Output() imagesChanged = new EventEmitter<string[]>();

  activeImage: string = '';

  ngOnInit() {
    if (this.images.length > 0) {
      this.activeImage = this.images[0];
    }
  }

  selectImage(img: string) {
    this.activeImage = img;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.images.push(e.target.result);
          if (!this.activeImage) this.activeImage = e.target.result;
          this.imagesChanged.emit(this.images);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number, event: Event) {
    event.stopPropagation();
    const removedImg = this.images[index];
    this.images.splice(index, 1);

    if (this.activeImage === removedImg) {
      this.activeImage = this.images.length > 0 ? this.images[0] : '';
    }
    this.imagesChanged.emit(this.images);
  }
}
