import { Injectable } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from '../../common/exceptions/custom-exceptions';
import { ShowtimeService } from '../showtimes/showtime.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRepository)
    private readonly bookingRepository: BookingRepository,
    private readonly showtimeService: ShowtimeService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if showtime exists
    const showtime = await this.showtimeService.findOne(
      createBookingDto.showtimeId,
    );
    if (!showtime) {
      throw new EntityNotFoundException(`Showtime not found`);
    }

    // Check if seat is already booked
    const existingBooking = await this.bookingRepository.findByShowtimeAndSeat(
      createBookingDto.showtimeId,
      createBookingDto.seatNumber,
    );

    if (existingBooking) {
      throw new EntityAlreadyExistsException(
        `Seat ${createBookingDto.seatNumber} is already booked for this showtime`,
      );
    }

    // Create and save booking
    const booking = this.bookingRepository.create({
      showtimeId: createBookingDto.showtimeId,
      seatNumber: createBookingDto.seatNumber,
      userId: createBookingDto.userId,
    });

    return await this.bookingRepository.save(booking);
  }
}
