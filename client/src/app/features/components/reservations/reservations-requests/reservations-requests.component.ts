import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../core/service/auth/auth.service";
import { ReservationsService } from "../../../../core/service/reservations/reservations.service";

@Component({
  selector: 'app-reservations-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations-requests.component.html',
  styleUrl: './reservations-requests.component.scss'
})
export class ReservationsRequestsComponent implements OnInit {
  requests: any[] = [];
  user: any;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private resService: ReservationsService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    const request$ = this.user.role === 'HOST'
      ? this.resService.getHostRequests(this.user.id)
      : this.resService.getGuestReservations(this.user.id);

    request$.subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  acceptRequest(id: number) {
    this.resService.acceptRequest(id).subscribe(() => {
      alert('Rezervacija prihvaćena! Ostali preklopljeni zahtevi su odbijeni.');
      this.loadRequests();
    });
  }

  rejectRequest(id: number) {
    this.resService.rejectRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  deleteRequest(id: number) {
    this.resService.deletePendingRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }
}
