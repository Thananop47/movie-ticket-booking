import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: 'seats',
    loadComponent: () => import('./seats/selectedSeats.component').then(m => m.SeatsComponent)
  },
  {
    path: 'confirm/:id',
    loadComponent: () => import('./bookingConfirm/bookingConfirm.component').then(m => m.BookingComponent)
  },
  {
    path: 'my-tickets',
    loadComponent: () => import('./my-tickets/my-tickets.component').then(m=>m.MyTicketsComponent)
  }
  
];