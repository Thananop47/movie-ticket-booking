import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenreType, Movie, PaginatedResponse } from '../../../core/models/interfaces';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MoviesService } from '../../../core/services/movie.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe, DatePipe } from '@angular/common';
import { formatDuration } from '../../../core/utils/time.util';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [FormsModule,SlicePipe],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit, OnDestroy {
  
  formatDuration = formatDuration;
  movies: Movie[] = [];
  pagination: PaginatedResponse<Movie>['pagination'] | null = null;
  loading = false;
  error = '';
  searchQuery = '';
  selectedGenre: GenreType | null = null;
  currentPage = 1;
  genres = Object.values(GenreType);
 
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
 
  constructor(private moviesService: MoviesService, private router: Router) {}
 
  ngOnInit() {
    this.loadMovies();
    // Debounce search to avoid hammering API on every keystroke
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadMovies();
    });
  }
 
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  loadMovies() {
    this.loading = true;
    this.error = '';
    this.moviesService.getMovies({
      search: this.searchQuery || undefined,
      genre: this.selectedGenre || undefined,
      isActive: true,
      page: this.currentPage,
      limit: 12,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.movies = res.data.data;
        this.pagination = res.data.pagination;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message?.[0] ?? 'Failed to load movies.';
        this.loading = false;
      },
    });
  }
 
  onSearchChange(value: string) { this.searchSubject.next(value); }
 
  filterByGenre(genre: GenreType | null) {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadMovies();
  }
 
  clearFilters() {
    this.searchQuery = '';
    this.selectedGenre = null;
    this.currentPage = 1;
    this.loadMovies();
  }
 
  changePage(page: number) {
    this.currentPage = page;
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  goToMovie(id: string) { this.router.navigate(['/movies', id]); }
 
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallbackUrl = 'https://placehold.co/300x450/1a1a2e/666?text=No+Poster';
    
    // ป้องกัน Infinite Loop: เปลี่ยนรูปก็ต่อเมื่อรูปปัจจุบันไม่ใช่รูป fallback
    if (img.src !== fallbackUrl) {
      img.src = fallbackUrl;
    }
  }

  
}
