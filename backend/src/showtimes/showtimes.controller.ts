import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('showtimes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }
}
