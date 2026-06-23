// ─── Enums ────────────────────────────────────────────────────────────────────
export enum UserRole { ADMIN = 'admin', USER = 'user' }
export enum SeatStatus { AVAILABLE = 'available', BOOKED = 'booked', RESERVED = 'reserved' }
export enum SeatType { STANDARD = 'STANDARD', PREMIUM = 'PREMIUM', VIP = 'VIP' }
export enum BookingStatus { CONFIRMED = 'confirmed', CANCELLED = 'cancelled', PENDING = 'pending' }
export enum GenreType {
  ACTION = 'ACTION',
  COMEDY = 'COMEDY',
  DRAMA = 'DRAMA',
  HORROR = 'HORROR',
  ROMANCE = 'ROMANCE',
  SCI_FI = 'SCI_FI',
  THRILLER = 'THRILLER',
  ANIMATION = 'ANIMATION',
  DOCUMENTARY = 'DOCUMENTARY',
  FANTASY = 'FANTASY',
}

export enum MovieStatus{
  Active,
  Inactive
}

// ─── Models ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: GenreType;
  durationMinutes: number;
  synopsis: string;
  posterUrl: string;
  isActive: boolean;
  createdAt: string;
  showtimes?: Showtime[];
}

export interface Showtime {
  id: string;
  movieId: string;
  movie?: Movie;
  hall: string;
  startTime: string;
  endTime: string;
  price: number;
  premiumPrice?: number;
  vipPrice?: number;
  isActive: boolean;
  seats?: Seat[];
}

export interface Seat {
  id: string;
  showtimeId: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
}

export interface Booking {
  id: string;
  bookingCode: string;
  user?: User;
  showtime: Showtime;
  seats: Seat[];
  totalAmount: number;
  status: BookingStatus;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  createdAt: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────
export interface CreateMovieRequest {
  title: string;
  genre: GenreType;
  durationMinutes: number;
  synopsis: string;
  isActive: boolean;
  posterUrl: string;
}

export interface CreateBookingRequest {
  showtimeId: string;
  seatIds: string[];
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { fullName: string; email: string; password: string; }
export interface AuthResponse { user: User; token: string; }