import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Movie } from './entities/movie.entity';
import { ShowtimeModule } from '../showtimes/showtime.module';
import { MovieRepository } from './repositories/movie.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    forwardRef(() => ShowtimeModule), // If needed for circular dependency
  ],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository], // Add MovieRepository
  exports: [MovieService, MovieRepository], // Export both
})
export class MovieModule {}
