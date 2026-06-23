// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },

  {
    path: 'movies',
    loadChildren: () => import('./features/movie/movie.route').then((m) => m.MOVIE_ROUTES),
  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.route').then((m)=>m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate:  [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.route').then((m) => m.ADMIN_ROUTES),
  },

  {
    path: 'booking',
    loadChildren: () => import('./features/booking/booking.route').then((m) => m.BOOKING_ROUTES)
  },
  { path: '**', redirectTo: '/movies' },
];