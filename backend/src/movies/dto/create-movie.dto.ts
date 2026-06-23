import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { GenreType } from 'src/common/enums/movie-genre.enum';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsEnum(GenreType)
  genre: GenreType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  synopsis: string;

  @IsInt()
  @IsNotEmpty()
  durationMinutes: number;

  @IsNotEmpty()
  @IsString()
  posterUrl: string;
}
