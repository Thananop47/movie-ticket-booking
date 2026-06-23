import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Showtime, Seat, SeatStatus, SeatType } from '../../../core/models/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { BookingsService } from '../../../core/services/booking.service';
import { DecimalPipe, DatePipe } from '@angular/common';


interface SeatRow { row: string; seats: Seat[];} 

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [DecimalPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './selectedSeats.component.html',
  styleUrl: './selectedSeats.component.css'
})
export class SeatsComponent implements OnInit {
  showtime: Showtime | null = null;
  seatRows: SeatRow[] = [];
  selectedSeats: Seat[] = [];
  loading = true;
  submitting = false;
  bookingError = '';
 
  bookerForm: FormGroup;
  SeatStatus = SeatStatus;
  SeatType = SeatType;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingsService: BookingsService,
    private authService: AuthService,
  ) {
    this.bookerForm = this.fb.group({
      bookerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      bookerEmail: ['', [Validators.required, Validators.email]],
      bookerPhone: [''],
    });
  }
 
  ngOnInit() {
    // Pre-fill form if user is logged in
    const user = this.authService.currentUser;
    if (user) {
      this.bookerForm.patchValue({
        bookerName: user.fullName,
        bookerEmail: user.email,
        bookerPhone: user.phone ?? '',
      });
    }
 
    const showtimeId = this.route.snapshot.queryParamMap.get('showtimeId');
    if (!showtimeId) { this.router.navigate(['/movies']); return; }
 
    this.bookingsService.getShowtime(showtimeId).subscribe({
      next: (res) => {
        this.showtime = res.data;
        this.buildSeatRows(res.data.seats ?? []);
        this.loading = false;
      },
      error: () => { this.loading = false; this.router.navigate(['/movies']); },
    });
  }
 
  private buildSeatRows(seats: Seat[]) {
    const rowMap = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
      rowMap.get(seat.row)!.push(seat);
    });
    rowMap.forEach((s) => s.sort((a, b) => a.number - b.number));
    this.seatRows = Array.from(rowMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, s]) => ({ row, seats: s }));
  }
 
  isSelected(seatId: string): boolean {
    return this.selectedSeats.some((s) => s.id === seatId);
  }
 
  toggleSeat(seat: Seat) {
    if (seat.status === SeatStatus.BOOKED) return;
    if (this.isSelected(seat.id)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s.id !== seat.id);
    } else {
      if (this.selectedSeats.length >= 8) {
        this.bookingError = 'Maximum 8 seats per booking.';
        setTimeout(() => (this.bookingError = ''), 3000);
        return;
      }
      this.selectedSeats = [...this.selectedSeats, seat];
    }
    this.bookingError = '';
  }
 
  get totalAmount(): number {
    if (!this.showtime) return 0;
    return this.selectedSeats.reduce((sum, seat) => {
      switch (seat.type) {
        case SeatType.VIP:
          return sum + Number(this.showtime!.vipPrice ?? this.showtime!.price * 2.5);
        case SeatType.PREMIUM:
          return sum + Number(this.showtime!.premiumPrice ?? this.showtime!.price * 1.5);
        default:
          return sum + Number(this.showtime!.price);
      }
    }, 0);
  }
 
  isInvalid(field: string): boolean {
    const ctrl = this.bookerForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
 
  submitBooking() {
    if (this.bookerForm.invalid) {
      this.bookerForm.markAllAsTouched();
      return;
    }
    if (this.selectedSeats.length === 0) {
      this.bookingError = 'Please select at least one seat.';
      return;
    }
 
    this.submitting = true;
    this.bookingError = '';
 
    const payload = {
      showtimeId: this.showtime!.id,
      seatIds: this.selectedSeats.map((s) => s.id),
      ...this.bookerForm.value,
    };
 
    this.bookingsService.createBooking(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/booking/confirm', res.data.id]);
      },
      error: (err) => {
        this.bookingError = err?.error?.message?.[0] ?? 'Booking failed. Please try again.';
        this.submitting = false;
      },
    });
  }
 
  goBack() { window.history.back(); }
}
