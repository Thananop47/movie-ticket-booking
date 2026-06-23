import {
  IsUUID,
  IsEmail,
  IsString,
  IsArray,
  ArrayMinSize,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  showtimeId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Must select at least one seat' })
  @IsUUID('4', { each: true, message: 'Each seat ID must be a valid UUID' })
  seatIds: string[];

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  bookerName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  bookerEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bookerPhone?: string;
}
