import { Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  ValidationFailedException,
} from '../../common/exceptions/custom-exceptions';
import { MovieService } from '../movies/movie.service';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { ShowtimeResponseDto } from './dtos/response-showtime.dto';

@Injectable()
export class ShowtimeService {
  constructor(
    private readonly showtimeRepository: ShowtimeRepository,
    private readonly movieService: MovieService,
  ) {}

  async findOne(id: number): Promise<ShowtimeResponseDto> {
    const showtime = await this.showtimeRepository.findByIdWithRelations(id);

    if (!showtime) {
      throw new EntityNotFoundException(`Showtime with ID ${id} not found`);
    }

    return {
      id: showtime.id,
      price: Number(showtime.price),
      movieId: showtime.movieId,
      theater: showtime.theater,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
    };
  }

  async create(
    createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeResponseDto> {
    // Verify movie exists
    await this.movieService.findOne(createShowtimeDto.movieId);

    // Validate start and end times
    const startTime = new Date(createShowtimeDto.startTime);
    const endTime = new Date(createShowtimeDto.endTime);

    if (startTime >= endTime) {
      throw new ValidationFailedException('End time must be after start time');
    }

    // Check for overlapping showtimes in the same theater
    const overlappingShowtimes =
      await this.showtimeRepository.findOverlappingShowtimes(
        createShowtimeDto.theater,
        startTime,
        endTime,
      );

    if (overlappingShowtimes.length > 0) {
      throw new EntityAlreadyExistsException(
        `There is an overlapping showtime in ${createShowtimeDto.theater} at the specified time`,
      );
    }

    const showtime = this.showtimeRepository.create({
      movieId: createShowtimeDto.movieId,
      theater: createShowtimeDto.theater,
      price: createShowtimeDto.price,
      startTime: startTime,
      endTime: endTime,
    });

    const savedShowtime = await this.showtimeRepository.save(showtime);
    return {
      id: savedShowtime.id,
      price: Number(savedShowtime.price),
      movieId: savedShowtime.movieId,
      theater: savedShowtime.theater,
      startTime: savedShowtime.startTime,
      endTime: savedShowtime.endTime,
    };
  }

  async update(
    id: number,
    updateShowtimeDto: CreateShowtimeDto,
  ): Promise<void> {
    // Check if showtime exists
    const showtime = await this.findOne(id);

    // Verify movie exists if movieId is changing
    if (updateShowtimeDto.movieId !== showtime.movieId) {
      await this.movieService.findOne(updateShowtimeDto.movieId);
    }

    // Update showtime properties
    Object.assign(showtime, updateShowtimeDto);
    await this.showtimeRepository.save(showtime);
  }

  async remove(id: number): Promise<void> {
    const result = await this.showtimeRepository.delete(id);

    if (result.affected === 0) {
      throw new EntityNotFoundException(`Showtime with ID ${id} not found`);
    }
  }
}
