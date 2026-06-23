import { Routes } from '@angular/router';

export const MOVIE_ROUTES: Routes = [
  {
    // Path ว่าง '' ในที่นี้จะหมายถึง /movies (หน้าหลักของฟีเจอร์นี้)
    path: '',
    loadComponent: () => import('./movie-list/movie.component').then(m => m.MovieComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./movie-details/movie-detail.component').then(m => m.MovieDetailComponent)
  }
  
];