import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import configuration from './config/configuration';
import { DatabaseModule } from './core/database/database.module';
import { MovieModule } from './modules/movies/movie.module';
import { ShowtimeModule } from './modules/showtimes/showtime.module';
import { BookingModule } from './modules/bookings/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    MovieModule,
    ShowtimeModule,
    BookingModule,
  ],
})
export class AppModule {}
