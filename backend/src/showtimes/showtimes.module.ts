import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { ShowtimeEntity } from './entities/showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from 'src/movies/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShowtimeEntity, SeatEntity, MovieEntity]),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
