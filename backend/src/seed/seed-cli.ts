import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { MovieEntity } from 'src/movies/entities/movie.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { runSeed } from './seed.service';

dotenv.config();

/**
 * CLI Seed Runner — รันแยกจาก NestJS application
 *
 * ใช้ตอน:
 * - Setup โปรเจกต์ครั้งแรกหลัง clone
 * - Reset ข้อมูล demo บน local
 *
 * คำสั่ง: npm run seed
 */
async function bootstrap() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'cinema_booking',
    entities: [
      MovieEntity,
      ShowtimeEntity,
      SeatEntity,
      BookingEntity,
      UserEntity,
    ],
    synchronize: false, // ไม่ sync ตรงนี้ — ให้ NestJS app จัดการ schema ตอน start ตามปกติ
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connected.\n');

    await runSeed(dataSource);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Database connection closed.');
  }
}

bootstrap();
