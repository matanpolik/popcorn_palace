import { DataSource, Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
export declare class BookingRepository extends Repository<Booking> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByShowtimeAndSeat(showtimeId: number, seatNumber: number): Promise<Booking>;
}
