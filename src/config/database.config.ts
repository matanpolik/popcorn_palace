import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Movie } from '../modules/movies/entities/movie.entity';
import { Showtime } from '../modules/showtimes/entities/showtime.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('app.database.host'),
      port: this.configService.get<number>('app.database.port'),
      username: this.configService.get<string>('app.database.username'),
      password: this.configService.get<string>('app.database.password'),
      database: this.configService.get<string>('app.database.name'),
      entities: [Movie, Showtime, Booking],
      synchronize: this.configService.get('NODE_ENV') !== 'production',
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }
}
