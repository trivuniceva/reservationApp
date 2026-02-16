import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../../core/service/reservations/reservations.service';
import { AuthService } from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-guest-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guest-reservations.component.html',
  styleUrl: './guest-reservations.component.scss'
})
export class GuestReservationsComponent implements OnInit {
  @Input() mode: 'ACTIVE' | 'HISTORY' = 'ACTIVE';

  allReservations: any[] = [];
  filteredReservations: any[] = [];
  user: any;
  isLoading = true;

  constructor(
    private resService: ReservationsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.resService.getGuestReservations(this.user.id).subscribe({
      next: (data) => {
        this.allReservations = data;
        this.filterData();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  filterData() {
    if (this.mode === 'ACTIVE') {
      this.filteredReservations = this.allReservations.filter(res =>
        res.status === 'PENDING' || res.status === 'ACCEPTED'
      );
    } else {
      this.filteredReservations = this.allReservations;
    }
  }

  cancelReservation(id: number) {
    if(confirm('Are you sure you want to cancel this reservation?')) {
      this.resService.cancelReservation(id).subscribe({
        next: () => {
          alert('Reservation cancelled.');
          this.loadData();
        },
        error: (err) => alert(err.error?.message || 'Cannot cancel reservation.')
      });
    }
  }

  deleteRequest(id: number) {
    this.resService.deletePendingRequest(id).subscribe(() => {
      this.loadData();
    });
  }
}
