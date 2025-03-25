import { Showtime } from '../../showtimes/entities/showtime.entity';
export declare class Booking {
    bookingId: string;
    showtimeId: number;
    seatNumber: number;
    userId: string;
    showtime: Showtime;
}
