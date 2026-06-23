import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { QueryMovieDto } from './dto/query-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  // สร้าง movie ใหม่
  async create(createMovieDto: CreateMovieDto) {
    // สร้างข้อมูลใหม่ผ่าน repository
    const dataUser = this.movieRepository.create(createMovieDto);
    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await this.movieRepository.save(dataUser);
    return result;
  }

  // ดึงข้อมูล movie ทั้งหมด
  async findAll(query: QueryMovieDto) {
    const { search, genre, isActive, page = 1, limit = 10 } = query;

    const qb = this.movieRepository.createQueryBuilder('movie');
    if (isActive !== undefined) {
      // แปลงค่าให้เป็น boolean ที่ถูกต้อง (รองรับทั้ง string 'true' และตัวเลข 1)
      const isMovieActive =
        isActive === true ||
        String(isActive) === 'true' ||
        String(isActive) === '1';
      qb.andWhere('movie.isActive = :isActive', { isActive: isMovieActive });
    }
    if (search) {
      qb.andWhere(
        'LOWER(movie.title) LIKE LOWER(:search) OR LOWER(movie.synopsis) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    if (genre) {
      qb.andWhere('movie.genre = :genre', { genre });
    }

    const total = await qb.getCount();
    const movies = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('movie.createdAt', 'DESC')
      .getMany();

    return {
      data: movies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ดึงข้อมูล movie ตาม id
  async findOne(id: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { showtimes: true },
    });
    if (!movie) {
      throw new NotFoundException(`Movie id:${id} not found`);
    }
    return movie;
  }

  // อัปเดตข้อมูล movie ตาม id
  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.movieRepository.update(id, updateMovieDto);
    const dataUserUpdate = await this.movieRepository.findOneBy({ id });
    if (!dataUserUpdate)
      throw new NotFoundException(`Movie id:${id} not found`);
    return dataUserUpdate;
  }

  // ลบข้อมูล movie ตาม id
  async remove(id: string) {
    const dataUser = await this.movieRepository.findOneBy({ id });
    if (!dataUser) {
      throw new NotFoundException(`Movie id: ${id} Not Found`);
    }
    return this.movieRepository.remove(dataUser);
  }
}
