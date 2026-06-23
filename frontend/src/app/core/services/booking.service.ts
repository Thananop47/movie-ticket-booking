import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, Showtime, ApiResponse, CreateBookingRequest } from '../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private readonly baseUrl = `${environment.apiUrl}/booking`;
  private readonly showtimesUrl = `${environment.apiUrl}/showtimes`;

  constructor(private http: HttpClient) {}

  getShowtime(id: string): Observable<ApiResponse<Showtime>> {
    return this.http.get<ApiResponse<Showtime>>(`${this.showtimesUrl}/${id}`);
  }

  createBooking(body: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.baseUrl, body);
  }

  getBooking(id: string): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.baseUrl}/${id}`);
  }

  getMyBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.baseUrl}/my`);
  }

  cancelBooking(id: string): Observable<ApiResponse<Booking>> {
    return this.http.delete<ApiResponse<Booking>>(`${this.baseUrl}/${id}`);
  }

  downloadTicketPdf(bookingId: string, bookingCode: string): void {
    const url = `${this.baseUrl}/${bookingId}/export-pdf`;
    // Use anchor trick so we get proper filename from Content-Disposition
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${bookingCode}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}