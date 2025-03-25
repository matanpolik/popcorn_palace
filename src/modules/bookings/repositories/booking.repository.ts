import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(private dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }

  async findByShowtimeAndSeat(
    showtimeId: number,
    seatNumber: number,
  ): Promise<Booking> {
    return this.findOne({
      where: {
        showtimeId,
        seatNumber,
      },
    });
  }
}
