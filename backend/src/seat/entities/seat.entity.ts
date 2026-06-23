import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ShowtimeEntity } from '../../showtimes/entities/showtime.entity';
import { SeatType } from 'src/common/enums/seat-type.enum';
import { SeatStatus } from 'src/common/enums/seat-status.enum';

@Entity('seats')
@Unique(['showtimeId', 'row', 'number']) // Prevent duplicate seats per showtime
export class SeatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShowtimeEntity, (showtime) => showtime.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtimeId' })
  showtime: ShowtimeEntity;

  @Column()
  showtimeId: string;

  @Column({ length: 2 }) // A, B, C, ...
  row: string;

  @Column()
  number: number; // 1, 2, 3, ...

  @Column({
    type: 'enum',
    enum: SeatType,
    default: SeatType.STANDARD,
  })
  type: SeatType;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get label(): string {
    return `${this.row}${this.number}`;
  }
}
