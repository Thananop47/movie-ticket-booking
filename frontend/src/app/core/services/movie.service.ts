import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Movie, Showtime, ApiResponse, PaginatedResponse,
  CreateMovieRequest, GenreType,
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private readonly baseUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) {}

  getMovies(params: { search?: string; genre?: GenreType; page?: number; limit?: number ; isActive?: boolean} = {}):
    Observable<ApiResponse<PaginatedResponse<Movie>>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.genre) httpParams = httpParams.set('genre', params.genre);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if(params.isActive) httpParams = httpParams.set('isActive', params.isActive);
    return this.http.get<ApiResponse<PaginatedResponse<Movie>>>(this.baseUrl, { params: httpParams });
  }

  getMovie(id: string): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/${id}`);
  }

  getShowtimes(movieId: string): Observable<ApiResponse<Showtime[]>> {
    return this.http.get<ApiResponse<Showtime[]>>(`${this.baseUrl}/${movieId}/showtimes`);
  }

  createMovie(body: CreateMovieRequest): Observable<ApiResponse<Movie>> {
    return this.http.post<ApiResponse<Movie>>(this.baseUrl, body);
  }

  updateMovie(id: string, body: Partial<CreateMovieRequest>): Observable<ApiResponse<Movie>> {
    return this.http.patch<ApiResponse<Movie>>(`${this.baseUrl}/${id}`, body);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}