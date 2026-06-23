import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { GenreType } from 'src/common/enums/movie-genre.enum';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsEnum(GenreType)
  genre: GenreType;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  synopsis: string;

  @IsInt()
  @IsOptional()
  durationMinutes: number;

  @IsOptional()
  @IsString()
  posterUrl: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
