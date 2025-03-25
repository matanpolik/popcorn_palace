import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingResponseDto } from './dtos/booking-response.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Book a ticket' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingService.create(createBookingDto);
    return { bookingId: booking.bookingId };
  }
}
