import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { ShowtimeService } from '../showtimes/showtime.service';
export declare class BookingService {
    private readonly bookingRepository;
    private readonly showtimeService;
    constructor(bookingRepository: BookingRepository, showtimeService: ShowtimeService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
}
