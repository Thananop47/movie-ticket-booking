import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieEntity } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity, ShowtimeEntity]),
    ShowtimesModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
