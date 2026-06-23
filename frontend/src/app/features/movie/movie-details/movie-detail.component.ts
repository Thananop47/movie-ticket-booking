import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie, Showtime } from '../../../core/models/interfaces';
import { MoviesService } from '../../../core/services/movie.service';
import { DatePipe,DecimalPipe } from '@angular/common';
import { formatDuration } from '../../../core/utils/time.util';
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit{
  formatDuration = formatDuration;
   movie: Movie | null = null;
  showtimes: Showtime[] = [];
  loading = true;
  loadingShowtimes = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService,
  ) {}
 
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.moviesService.getMovie(id).subscribe({
      next: (res) => {
        this.movie = res.data;
        this.loading = false;
        this.loadShowtimes(id);
      },
      error: () => { this.loading = false; },
    });
  }
 
  loadShowtimes(movieId: string) {
    this.loadingShowtimes = true;
    this.moviesService.getShowtimes(movieId).subscribe({
      next: (res) => {
        this.showtimes = res.data.filter(
          (s) => new Date(s.startTime) > new Date(), // Only future showtimes
        );
        this.loadingShowtimes = false;
      },
      error: () => { this.loadingShowtimes = false; },
    });
  }
 
  bookShowtime(showtime: Showtime) {
    this.router.navigate(['/booking/seats'], {
      queryParams: { showtimeId: showtime.id },
    });
  }
 
  goBack() { window.history.back(); }
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallbackUrl = 'https://placehold.co/300x450/1a1a2e/666?text=No+Poster';
    
    // ป้องกัน Infinite Loop: เปลี่ยนรูปก็ต่อเมื่อรูปปัจจุบันไม่ใช่รูป fallback
    if (img.src !== fallbackUrl) {
      img.src = fallbackUrl;
    }
  }
}
