import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MovieEntity } from '../../movies/entities/movie.entity';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { SeatEntity } from 'src/seat/entities/seat.entity';

@Entity('showtimes')
export class ShowtimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MovieEntity, (movie) => movie.showtimes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie: MovieEntity;

  @Column()
  movieId: string;

  @Column()
  hall: string; // e.g. "Hall A", "Hall B"

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  premiumPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vipPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => SeatEntity, (seat) => seat.showtime, { cascade: true })
  seats: SeatEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.showtime)
  bookings: BookingEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
