import { DataSource } from 'typeorm';

import { UserRole } from '../common/enums/user-role.enum';
import { MOVIE_SEED_DATA } from './movie-seed-data';
import { UserEntity } from 'src/users/entities/user.entity';
import { SeatEntity } from 'src/seat/entities/seat.entity';
import { SeatType } from 'src/common/enums/seat-type.enum';
import { SeatStatus } from 'src/common/enums/seat-status.enum';
import { MovieEntity } from 'src/movies/entities/movie.entity';
import { ShowtimeEntity } from 'src/showtimes/entities/showtime.entity';

/**
 * Seed Script — สร้างข้อมูลตั้งต้นสำหรับ Development/Demo
 *
 * สร้าง:
 * 1. Admin account (อ่าน credential จาก .env)
 * 2. 15 หนัง ครอบคลุมทุก Genre
 * 3. แต่ละหนังมี 2 รอบฉาย (เช้า/เย็น) พร้อม seat map auto-generate
 *
 * ออกแบบให้ "idempotent" — รันซ้ำได้โดยไม่สร้างข้อมูลซ้ำ
 * เพราะเช็คก่อนทุกครั้งว่ามีอยู่แล้วหรือยัง
 */

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const HALLS = ['Hall A', 'Hall B', 'Hall C'];

// ─── Seed Admin Account ─────────────────────────────────────────────────────
async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(UserEntity);

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@cinema.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';

  const existing = await userRepo.findOne({ where: { email: adminEmail } });
  if (existing) {
    console.log(`⏭  Admin already exists (${adminEmail}), skipping.`);
    return;
  }

  const admin = userRepo.create({
    fullName: 'System Admin',
    email: adminEmail,
    password: adminPassword, // hash อัตโนมัติผ่าน @BeforeInsert ใน User entity
    role: UserRole.ADMIN,
    isActive: true,
  });

  await userRepo.save(admin);
  console.log(
    `✅ Admin created → email: ${adminEmail} / password: ${adminPassword}`,
  );
  console.log(`   ⚠️  เปลี่ยนรหัสผ่านนี้ทันทีถ้าจะใช้งานจริงนอก localhost`);
}

// ─── Generate Seats สำหรับ 1 Showtime ───────────────────────────────────────
function buildSeatsForShowtime(
  showtimeId: string,
  rows: number,
  seatsPerRow: number,
): Partial<SeatEntity>[] {
  const seats: Partial<SeatEntity>[] = [];

  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      let type = SeatType.STANDARD;
      if (r >= rows - 2) type = SeatType.VIP;
      else if (r >= rows - 4) type = SeatType.PREMIUM;

      seats.push({
        showtimeId,
        row: ROW_LETTERS[r],
        number: s,
        type,
        status: SeatStatus.AVAILABLE,
      });
    }
  }
  return seats;
}

// ─── Seed Movies + Showtimes ────────────────────────────────────────────────
async function seedMoviesAndShowtimes(dataSource: DataSource): Promise<void> {
  const movieRepo = dataSource.getRepository(MovieEntity);
  const showtimeRepo = dataSource.getRepository(ShowtimeEntity);
  const seatRepo = dataSource.getRepository(SeatEntity);

  const existingCount = await movieRepo.count();
  if (existingCount > 0) {
    console.log(
      `⏭  Movies already seeded (${existingCount} found), skipping.`,
    );
    return;
  }

  console.log(`🎬 Seeding ${MOVIE_SEED_DATA.length} movies...`);

  for (let i = 0; i < MOVIE_SEED_DATA.length; i++) {
    const movieData = MOVIE_SEED_DATA[i];

    // 1. สร้างหนัง
    const movie = movieRepo.create({ ...movieData, isActive: true });
    const savedMovie = await movieRepo.save(movie);

    // 2. สร้าง 2 รอบฉาย — รอบเช้า (วันนี้+1 วัน 14:00) และรอบเย็น (วันนี้+1 วัน 19:30)
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1); // พรุ่งนี้ ป้องกัน "showtime ที่ผ่านมาแล้ว"
    baseDate.setHours(0, 0, 0, 0);

    const showtimeConfigs = [
      { hour: 14, minute: 0, priceMultiplier: 1.0 }, // รอบบ่าย ราคาปกติ
      { hour: 19, minute: 30, priceMultiplier: 1.2 }, // รอบเย็น ราคาสูงกว่า (prime time)
    ];

    const basePrice = 180 + (i % 4) * 20; // ราคาฐานสลับกันเล็กน้อยให้ดูสมจริง

    for (const config of showtimeConfigs) {
      const startTime = new Date(baseDate);
      startTime.setHours(config.hour, config.minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + movieData.durationMinutes + 15); // +15 นาที buffer ทำความสะอาดโรง

      const price = Math.round(basePrice * config.priceMultiplier);

      const showtime = showtimeRepo.create({
        movieId: savedMovie.id,
        hall: HALLS[i % HALLS.length],
        startTime,
        endTime,
        price,
        premiumPrice: Math.round(price * 1.5),
        vipPrice: Math.round(price * 2.5),
        isActive: true,
      });

      const savedShowtime = await showtimeRepo.save(showtime);

      // 3. Generate seat map สำหรับรอบฉายนี้ (6 แถว x 10 ที่นั่ง = 60 ที่/รอบ)
      const seats = buildSeatsForShowtime(savedShowtime.id, 6, 10);
      await seatRepo.save(seats);
    }

    console.log(
      `   ✅ [${i + 1}/${MOVIE_SEED_DATA.length}] ${movieData.title} — 2 showtimes created`,
    );
  }

  console.log(`🎉 Movie + Showtime seeding complete.`);
}

// ─── Entry Point ─────────────────────────────────────────────────────────────
export async function runSeed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seed...\n');

  await seedAdmin(dataSource);
  console.log('');
  await seedMoviesAndShowtimes(dataSource);

  console.log('\n✨ Seed finished.');
}
