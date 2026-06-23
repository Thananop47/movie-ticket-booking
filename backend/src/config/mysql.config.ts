import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieEntity } from 'src/movies/entities/movie.entity';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookingEntity } from 'src/booking/entities/booking.entity';

export const mysql = {
  import: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [
      MovieEntity,
      SeatEntity,
      ShowtimeEntity,
      UserEntity,
      BookingEntity,
    ],
    synchronize: true,
  }),
};
