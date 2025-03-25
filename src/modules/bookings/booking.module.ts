import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { ShowtimeModule } from '../showtimes/showtime.module';
import { BookingRepository } from './repositories/booking.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingRepository]),
    forwardRef(() => ShowtimeModule),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
