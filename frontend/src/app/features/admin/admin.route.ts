import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    // Path ว่าง '' ในที่นี้จะหมายถึง /movies (หน้าหลักของฟีเจอร์นี้)
    path: '',
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
  },

  {
    path: 'movies/new',
    loadComponent: () => import('../movie/movie-from/movie-from.component').then(m=>m.MovieFromComponent)
  },
  {
    path: 'movies/:id/edit',
    loadComponent: () => import('../movie/movie-from/movie-from.component').then(m=>m.MovieFromComponent)
  }
  
];