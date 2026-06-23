import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreType, MovieStatus } from '../../../core/models/interfaces';
import { MoviesService } from '../../../core/services/movie.service';

const URL_PATTERN = /^https?:\/\/.+\..+/i;

@Component({
  selector: 'app-movie-from',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movie-from.component.html',
  styleUrl: './movie-from.component.css'
})
export class MovieFromComponent implements OnInit {
 form: FormGroup;
  isEdit = false;
  movieId = '';
  submitting = false;
  loadingMovie = false;
  submitError = '';
  previewLoaded = false;
  genres = Object.values(GenreType);
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private moviesService: MoviesService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      genre: ['', [Validators.required]],
      durationMinutes: [null, [Validators.required, Validators.min(1), Validators.max(600)]],
      
      synopsis: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      posterUrl: ['', [Validators.required, Validators.pattern(URL_PATTERN)]],
    });
  }
 
  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.movieId) {
      this.isEdit = true;
      this.loadingMovie = true;
      this.moviesService.getMovie(this.movieId).subscribe({
        next: (res) => {
          const m = res.data;
          this.form.patchValue({
            title: m.title,
            genre: m.genre,
            durationMinutes: m.durationMinutes,
            synopsis: m.synopsis,
            posterUrl: m.posterUrl,
           
          });
          this.loadingMovie = false;
        },
        error: () => { this.loadingMovie = false; this.router.navigate(['/admin']); },
      });
    }
  }
 
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl?.touched || ctrl?.dirty));
  }
 
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.submitError = '';
 
    const payload = this.form.value;
    const req$ = this.isEdit
      ? this.moviesService.updateMovie(this.movieId, payload)
      : this.moviesService.createMovie(payload);
 
    req$.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        this.submitError = err?.error?.message?.[0] ?? 'Failed to save. Please try again.';
        this.submitting = false;
      },
    });
  }
 
  onPreviewError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
    this.previewLoaded = false;
  }
}
