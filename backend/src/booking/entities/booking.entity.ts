import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { SeatEntity } from 'src/seat/entities/seat.entity';
import { BookingStatus } from 'src/common/enums/booking.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingCode: string; // e.g. "CB-20240617-ABCD"

  @ManyToOne(() => UserEntity, (user) => user.bookings, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity | null;

  @Column({ nullable: true })
  userId: string | null;

  @ManyToOne(() => ShowtimeEntity, (showtime) => showtime.bookings, {
    eager: true,
  })
  @JoinColumn({ name: 'showtimeId' })
  showtime: ShowtimeEntity;

  @Column()
  showtimeId: string;

  @ManyToMany(() => SeatEntity, { eager: true })
  @JoinTable({
    name: 'booking_seats', // ชื่อตารางกลาง (Junction Table)
    joinColumn: { name: 'bookingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seatId', referencedColumnName: 'id' },
  })
  seats: SeatEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  // Snapshot of booker info at time of booking
  @Column()
  bookerName: string;

  @Column()
  bookerEmail: string;

  @Column({ nullable: true })
  bookerPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
