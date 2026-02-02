import { AfterViewInit, Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-section',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="map" style="height: 100%; min-height: 300px; width: 100%;"></div>`,
  styles: [`#map { background: #eee; }`]
})
export class MapSectionComponent implements AfterViewInit {
  @Input() apartment: any;
  private map: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.initMap(L);
    }
  }

  private initMap(L: any): void {
    this.map = L.map('map').setView([45.2671, 19.8335], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([45.2671, 19.8335])
      .addTo(this.map)
      .bindPopup(this.apartment?.name || 'Property')
      .openPopup();
  }
}
