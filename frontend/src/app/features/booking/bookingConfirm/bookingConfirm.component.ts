import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking, SeatType } from '../../../core/models/interfaces';
import { BookingsService } from '../../../core/services/booking.service';
import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [DatePipe, DecimalPipe, SlicePipe],
  templateUrl: './bookingConfirm.component.html',
  styleUrl: './bookingConfirm.component.css'
})
export class BookingComponent implements OnInit{
booking: Booking | null = null;
  loading = true;
  downloading = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingsService: BookingsService,
  ) {}
 
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.bookingsService.getBooking(id).subscribe({
      next: (res) => {
        this.booking = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
 
  getSeatPrice(type: string): number {
    if (!this.booking?.showtime) return 0;
    const { price, premiumPrice, vipPrice } = this.booking.showtime;
    if (type === SeatType.VIP) return Number(vipPrice ?? price * 2.5);
    if (type === SeatType.PREMIUM) return Number(premiumPrice ?? price * 1.5);
    return Number(price);
  }
 
  downloadPdf() {
    if (!this.booking) return;
    this.downloading = true;
    this.bookingsService.downloadTicketPdf(this.booking.id, this.booking.bookingCode);
    // Give browser time to start download
    setTimeout(() => (this.downloading = false), 2000);
  }
 
 onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallbackUrl = 'https://placehold.co/300x450/1a1a2e/666?text=No+Poster';
    
    // ป้องกัน Infinite Loop: เปลี่ยนรูปก็ต่อเมื่อรูปปัจจุบันไม่ใช่รูป fallback
    if (img.src !== fallbackUrl) {
      img.src = fallbackUrl;
    }
  }
}
