import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from '../../model/apartment.model';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private apiUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) { }

  createProperty(apartment: Apartment): Observable<Apartment> {
    return this.http.post<Apartment>(this.apiUrl, apartment);
  }

  getPropertiesByOwner(ownerId: number): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  approveProperty(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/approve`, {});
  }
}
