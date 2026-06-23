import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsUUID()
  movieId: string;

  @IsString()
  hall: string;

  @IsDateString()
  startTime: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  premiumPrice?: number;

  @IsOptional()
  @IsNumber()
  vipPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(26)
  rows: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  seatsPerRow: number;
}
