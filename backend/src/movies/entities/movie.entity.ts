import { GenreType } from 'src/common/enums/movie-genre.enum';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: GenreType })
  genre: GenreType;

  @Column()
  synopsis: string;

  @OneToMany(() => ShowtimeEntity, (showtime) => showtime.movie)
  showtimes: ShowtimeEntity[];

  @Column()
  durationMinutes: number;

  @Column()
  posterUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
