import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { Showtime } from './entities/showtime.entity';
import { MovieModule } from '../movies/movie.module';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { BookingModule } from '../bookings/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    forwardRef(() => MovieModule),
    forwardRef(() => BookingModule),
  ],
  controllers: [ShowtimeController],
  providers: [ShowtimeService, ShowtimeRepository],
  exports: [ShowtimeService, ShowtimeRepository],
})
export class ShowtimeModule {}
