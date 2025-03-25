import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';
import { Showtime } from './entities/showtime.entity';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get(':showtimeId')
  @ApiOperation({ summary: 'Get showtime by ID' })
  @ApiResponse({
    status: 200,
    description: 'Showtime found',
    type: Showtime,
  })
  async findOne(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return await this.showtimeService.findOne(showtimeId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a showtime' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Showtime created successfully',
    type: Showtime,
  })
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return await this.showtimeService.create(createShowtimeDto);
  }

  @Post('update/:showtimeId')
  @ApiOperation({ summary: 'Update a showtime' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Showtime updated successfully' })
  async update(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body() updateShowtimeDto: CreateShowtimeDto,
  ) {
    return await this.showtimeService.update(showtimeId, updateShowtimeDto);
  }

  @Delete(':showtimeId')
  @ApiOperation({ summary: 'Delete a showtime' })
  @ApiResponse({ status: 200, description: 'Showtime deleted successfully' })
  async remove(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return await this.showtimeService.remove(showtimeId);
  }
}
