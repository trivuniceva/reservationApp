import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, Observable, startWith, switchMap, catchError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedPropertyId?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private apiUrl = 'http://localhost:8080/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      interval(10000).pipe(
        startWith(0),
        switchMap(() => this.getUnreadNotifications().pipe(
          catchError(() => of([]))
        ))
      ).subscribe(notifs => {
        this.ngZone.run(() => {
          this.unreadCountSubject.next(notifs.length);
        });
      });
    });
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/admin`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {});
  }
}
