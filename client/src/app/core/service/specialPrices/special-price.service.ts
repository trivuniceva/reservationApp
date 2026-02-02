import { Injectable } from '@angular/core';
import {AvailabilityInterval, SpecialPrice} from "../../model/apartment.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SpecialPriceService {

  private readonly API_URL = 'http://localhost:8080/special-prices';

  constructor(private http: HttpClient) {}

  updateAvailability(apartmentId: number, intervals: AvailabilityInterval[]): Observable<any> {
    return this.http.put(`${this.API_URL}/availability/${apartmentId}`, intervals);
  }

  addSpecialPrice(apartmentId: number, priceRule: SpecialPrice): Observable<any> {
    return this.http.post(`${this.API_URL}/pricing/${apartmentId}`, priceRule);
  }

  getReservedDates(apartmentId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/reserved/${apartmentId}`);
  }

}
