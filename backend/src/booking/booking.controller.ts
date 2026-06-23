import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Res,
  Delete,
} from '@nestjs/common';
import type { Response } from 'express';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PdfService } from 'src/pdf/pdf.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly pdfService: PdfService,
  ) {}

  // create booking
  @Post()
  @Public()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.bookingService.create(createBookingDto, userId);
  }

  //get current user booking
  @Get('my')
  getMybookings(@CurrentUser('id') userId: string) {
    return this.bookingService.findByUser(userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  //Download ticket as pdf
  @Get(':id/export-pdf')
  @Public()
  async exportPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const booking = await this.bookingService.findOne(id);
    const pdfBuffer = await this.pdfService.generateTicket(booking);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${booking.bookingCode}.pdf"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store',
    });
    res.end(pdfBuffer);
  }

  @Delete(':id')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingService.cancle(id, userId);
  }
}
