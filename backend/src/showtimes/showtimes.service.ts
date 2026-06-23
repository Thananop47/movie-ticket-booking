import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entities/showtime.entity';
import { Repository } from 'typeorm';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { SeatStatus } from 'src/common/enums/seat-status.enum';
import { SeatType } from 'src/common/enums/seat-type.enum';
import { MovieEntity } from 'src/movies/entities/movie.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(ShowtimeEntity)
    private readonly showtimeRepository: Repository<ShowtimeEntity>,
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<ShowtimeEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id: createShowtimeDto.movieId }, // สมมติว่าใน Dto ส่ง movieId มา
    });
    if (!movie) {
      throw new NotFoundException(`Movie not found`);
    }
    const newStartTime = new Date(createShowtimeDto.startTime);
    const bufferMinutes = 30; // เวลาเผื่อทำความสะอาด
    const totalMinutes = movie.durationMinutes + bufferMinutes;
    const newEndTime = new Date(newStartTime.getTime() + totalMinutes * 60000);
    const hall = createShowtimeDto.hall;

    const overlappingShowtime = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.hall = :hall', { hall })
      .andWhere('showtime.isActive = :isActive', { isActive: true }) // เช็คเฉพาะรอบที่เปิดใช้งานอยู่
      .andWhere('showtime.startTime < :newEnd', { newEnd: newEndTime }) // เริ่มใหม่ต้องไม่แทรกก่อนรอบเดิมจบ
      .andWhere('showtime.endTime > :newStart', { newStart: newStartTime }) // จบใหม่ต้องไม่ล้ำเข้าไปตอนรอบเดิมเริ่ม
      .getOne();

    // ถ้ามีรอบที่ทับซ้อนกัน ให้เตะออกแล้วโยน Error กลับไปหาหน้าบ้าน
    if (overlappingShowtime) {
      // ดึงเวลาเดิมมาจัดฟอร์แมตให้สวยงามเพื่อบอกแอดมิน (เอาไว้โชว์ Error)
      const existStart = overlappingShowtime.startTime.toLocaleTimeString(
        'th-TH',
        { hour: '2-digit', minute: '2-digit' },
      );
      const existEnd = overlappingShowtime.endTime.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      });

      throw new ConflictException(
        `ไม่สามารถสร้างรอบฉายได้ เนื่องจากโรงที่ ${hall} มีคิวฉายติดพันช่วงเวลา ${existStart} - ${existEnd}`,
      );
    }

    const showtime = this.showtimeRepository.create({
      ...createShowtimeDto,
      startTime: newStartTime,
      endTime: newEndTime,
    });
    const saved = await this.showtimeRepository.save(showtime);

    await this.generateSeats(
      saved.id,
      createShowtimeDto.rows || 8,
      createShowtimeDto.seatsPerRow || 10,
    );
    return this.findOne(saved.id);
  }

  // function to generate seats for a showtime
  private async generateSeats(
    showtimeId: string,
    rows: number,
    seatsPerRow: number,
  ): Promise<void> {
    const seats: Partial<SeatEntity>[] = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        let type = SeatType.STANDARD;
        if (r >= rows - 2) type = SeatType.VIP;
        else if (r >= rows - 4) type = SeatType.PREMIUM;

        seats.push({
          showtimeId,
          row: rowLetters[r],
          number: s,
          type,
          status: SeatStatus.AVAILABLE,
        });
      }
    }
    await this.seatRepository.save(seats);
  }

  async findByMovie(movieId: string): Promise<ShowtimeEntity[]> {
    return this.showtimeRepository.find({
      where: { movieId, isActive: true },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ShowtimeEntity> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: { movie: true, seats: true },
    });
    if (!showtime) {
      throw new Error(`Showtime with ID ${id} not found`);
    }
    return showtime;
  }

  async findOneWithSeats(id: string): Promise<ShowtimeEntity> {
    const showtime = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.seats', 'seat')
      .where('showtime.id = :id', { id })
      .orderBy('seat.row', 'ASC')
      .addOrderBy('seat.number', 'ASC')
      .getOne();
    if (!showtime) throw new NotFoundException(`Showtimes #${id} not found`);
    return showtime;
  }
}
