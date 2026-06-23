import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingStatus } from '../../../core/models/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { BookingsService } from '../../../core/services/booking.service';
import { UpperCasePipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [UpperCasePipe, DatePipe, DecimalPipe],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent implements OnInit{
bookings: Booking[] = [];
  loading = false;
  isLoggedIn = false;
confirmed: any;
 
  constructor(
    private authService: AuthService,
    private bookingsService: BookingsService,
    private router: Router,
  ) {}
 
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn) {
      this.loading = true;
      this.bookingsService.getMyBookings().subscribe({
        next: (res) => { this.bookings = res.data; this.loading = false; },
        error: () => { this.loading = false; },
      });
    }
  }
 getSeatNames(seats: any[]): string {
  if (!seats || seats.length === 0) return '';
  // ทำการ map และ join ในไฟล์ .ts แทน
  return seats.map(s => s.row + s.number).join(', ');
}
  download(booking: Booking) {
    this.bookingsService.downloadTicketPdf(booking.id, booking.bookingCode);
  }
 
  viewBooking(id: string) { this.router.navigate(['/booking/confirm', id]); }
 
  cancelBooking(booking: Booking) {
    if (!confirm(`Cancel booking ${booking.bookingCode}? This cannot be undone.`)) return;
    this.bookingsService.cancelBooking(booking.id).subscribe({
      next: () => {
        const idx = this.bookings.findIndex((b) => b.id === booking.id);
        if (idx !== -1) this.bookings[idx] = { ...this.bookings[idx], status: BookingStatus.CANCELLED };
      },
    });
  }
 
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://via.placeholder.com/60x85/1a1a2e/666?text=🎬';
  }
}
