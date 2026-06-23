import { Component } from '@angular/core';
import { Booking, GenreType, Movie, SeatType } from '../../core/models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../../core/services/booking.service';
import { DecimalPipe, DatePipe , SlicePipe} from '@angular/common';
import { MoviesService } from '../../core/services/movie.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
   movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  loading = true;
  deleting = false;
  movieToDelete: Movie | null = null;
  searchQuery = '';
  selectedGenre: GenreType | null = null;
  genres = Object.values(GenreType);
  currentPage = 1;
  totalPages = 1;
  totalMovies = 0;
  activeMovies = 0;

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
 
  constructor(public router: Router, private moviesService: MoviesService) {}
 
  ngOnInit() { this.loadMovies(); }
 
  loadMovies() {
    this.loading = true;
    this.moviesService.getMovies({ page: this.currentPage, limit: 20 }).subscribe({
      next: (res) => {
        this.movies = res.data.data;
        this.totalMovies = res.data.pagination.total;
        this.totalPages = res.data.pagination.totalPages;
        this.activeMovies = this.movies.filter((m) => m.isActive).length;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
 
  applyFilter() {
    let filtered = [...this.movies];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(q) || m.synopsis?.toLowerCase().includes(q),
      );
    }
    if (this.selectedGenre) {
      filtered = filtered.filter((m) => m.genre === this.selectedGenre);
    }
    this.filteredMovies = filtered;
  }
 
  onSearch() { this.applyFilter(); }
 
  editMovie(id: string) { this.router.navigate(['/admin/movies', id, 'edit']); }
 
  toggleActive(movie: Movie) {
    this.moviesService.updateMovie(movie.id, { isActive: !movie.isActive }).subscribe({
      next: (res) => {
        const idx = this.movies.findIndex((m) => m.id === movie.id);
        if (idx !== -1) this.movies[idx] = res.data;
        this.applyFilter();
      },
    });
  }
 
  confirmDelete(movie: Movie) { this.movieToDelete = movie; }
  cancelDelete() { this.movieToDelete = null; }
 
  deleteMovie() {
    if (!this.movieToDelete) return;
    this.deleting = true;
    this.moviesService.deleteMovie(this.movieToDelete.id).subscribe({
      next: () => {
        this.movies = this.movies.filter((m) => m.id !== this.movieToDelete!.id);
        this.applyFilter();
        this.movieToDelete = null;
        this.deleting = false;
      },
      error: () => { this.deleting = false; },
    });
  }
 
  changePage(page: number) { this.currentPage = page; this.loadMovies(); }
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallbackUrl = 'https://placehold.co/300x450/1a1a2e/666?text=No+Poster';
    
    // ป้องกัน Infinite Loop: เปลี่ยนรูปก็ต่อเมื่อรูปปัจจุบันไม่ใช่รูป fallback
    if (img.src !== fallbackUrl) {
      img.src = fallbackUrl;
    }
  }
}
