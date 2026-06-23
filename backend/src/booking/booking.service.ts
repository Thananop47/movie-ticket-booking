import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import { Repository, DataSource, In } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { SeatType } from 'src/common/enums/seat-type.enum';
import { SeatStatus } from 'src/common/enums/seat-status.enum';
import { BookingStatus } from 'src/common/enums/booking.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
    @InjectRepository(ShowtimeEntity)
    private readonly showtimeRepository: Repository<ShowtimeEntity>,
    private readonly dataSource: DataSource,
  ) {}

  //generate unique booking code
  private generateBookingCode(): string {
    const prefix = 'CB';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${datePart}-${randomPart}`;
  }

  //calculate total based on seat types
  private calculateTotal(
    seats: SeatEntity[],
    showtimes: ShowtimeEntity,
  ): number {
    return seats.reduce((sum, seat) => {
      switch (seat.type) {
        case SeatType.VIP:
          return sum + Number(showtimes.vipPrice ?? showtimes.price * 2.5);
        case SeatType.PREMIUM:
          return sum + Number(showtimes.premiumPrice ?? showtimes.price * 1.5);
        default:
          return sum + Number(showtimes.price);
      }
    }, 0);
  }
  // สร้าง booking transaction และ lock seat
  async create(
    createBookingDto: CreateBookingDto,
    userId?: string,
  ): Promise<BookingEntity> {
    return this.dataSource.transaction(async (manager) => {
      const seatRepo = manager.getRepository(SeatEntity);
      const showtimeRepo = manager.getRepository(ShowtimeEntity);
      const bookingRepo = manager.getRepository(BookingEntity);

      //ล็อคที่นัง และป้องกันการจองที่นั่งพร้อมกัน
      const seats = await seatRepo
        .createQueryBuilder('seat')
        .setLock('pessimistic_write')
        .where('seat.id IN (:...ids)', { ids: createBookingDto.seatIds })
        .andWhere('seat.showtimeId = :showtimeId', {
          showtimeId: createBookingDto.showtimeId,
        })
        .getMany();

      //Validate: all requested seat IDs exist for this showtime
      if (seats.length !== createBookingDto.seatIds.length) {
        throw new NotFoundException(
          'One or more seats not found for this showtime',
        );
      }

      //Validate: none of the seats are already taken
      const takenSeats = seats.filter((s) => s.status !== SeatStatus.AVAILABLE);
      if (takenSeats.length > 0) {
        const takenLabels = takenSeats
          .map((s) => `${s.row}${s.number}`)
          .join(', ');
        throw new ConflictException(
          `Seats already taken booked: ${takenLabels}. Please choose different seats.`,
        );
      }

      // Fetch showtime
      const showtime = await showtimeRepo.findOne({
        where: { id: createBookingDto.showtimeId, isActive: true },
      });
      if (!showtime)
        throw new NotFoundException('Showtime not found or inactive');

      //ไม่สามารถเลือกที่นั่งหลังจากที่ผ่านเวลาแสดงไปแล้ว
      if (new Date(showtime.startTime) < new Date()) {
        throw new BadRequestException(
          'Cannot book a showtime that has already started',
        );
      }

      //ทำเครื่องหมายว่าที่นั่งถูกจองแล้ว
      await seatRepo.update(
        { id: In(createBookingDto.seatIds) },
        { status: SeatStatus.BOOKED },
      );

      //คำนวณราคา
      const totalAmount = this.calculateTotal(seats, showtime);

      //สร้าง booking record
      const booking = bookingRepo.create({
        bookingCode: this.generateBookingCode(),
        showtimeId: createBookingDto.showtimeId,
        userId: userId ?? undefined,
        seats,
        totalAmount,
        status: BookingStatus.CONFIRMED,
        bookerName: createBookingDto.bookerName,
        bookerEmail: createBookingDto.bookerEmail,
        bookerPhone: createBookingDto.bookerPhone,
      });
      return bookingRepo.save(booking);
    });
  }

  async findOne(id: string): Promise<BookingEntity> {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.showtime', 'showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('booking.seats', 'seat')
      .where('booking.id = :id', { id })
      .orderBy('seat.row', 'ASC')
      .addOrderBy('seat.number', 'ASC')
      .getOne();

    if (!booking) throw new NotFoundException(`booking #${id} not fount`);
    return booking;
  }

  async findByUser(userId: string): Promise<BookingEntity[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.showtime', 'showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('booking.seats', 'seat')
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  async cancle(id: string, userId: string): Promise<BookingEntity> {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new BadRequestException('You can only cancle your own booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const seatIds = booking.seats.map((s) => s.id);
    await this.seatRepository.update(
      { id: In(seatIds) },
      { status: SeatStatus.AVAILABLE },
    );

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }
}
