import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation);
  }

  getGuestReservations(guestId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/guest/${guestId}`);
  }

  getHostRequests(hostId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/host/${hostId}`);
  }

  acceptRequest(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/accept`, {});
  }

  rejectRequest(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reject`, {});
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deletePendingRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
