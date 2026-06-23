import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      SeatEntity,
      ShowtimeEntity,
      UserEntity,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, PdfService],
  exports: [BookingService],
})
export class BookingModule {}
