import { Injectable } from '@nestjs/common';
import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { Movie } from './entities/movie.entity';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
} from '../../common/exceptions/custom-exceptions';
import { MovieResponseDto } from './dtos/response-movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async findAll(): Promise<MovieResponseDto[]> {
    const [movies] = await this.movieRepository.findAllWithPagination();
    return movies.map((movie) => ({
      ...movie,
      rating: Number(movie.rating), // Convert to a number!
    }));
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    // Check if movie with the same title already exists
    const existingMovie = await this.movieRepository.findByTitle(
      createMovieDto.title,
    );
    if (existingMovie) {
      throw new EntityAlreadyExistsException(
        `Movie with title "${createMovieDto.title}" already exists`,
      );
    }

    const movie = this.movieRepository.create(createMovieDto);
    const savedMovie = await this.movieRepository.save(movie);

    return {
      id: savedMovie.id,
      title: savedMovie.title,
      genre: savedMovie.genre,
      duration: savedMovie.duration,
      rating: Number(savedMovie.rating), // Ensure number
      releaseYear: savedMovie.releaseYear,
    };
  }

  async updateByTitle(title: string, updateMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.findByTitle(title);
    if (!movie) {
      throw new EntityNotFoundException(
        `Movie with title "${title}" not found`,
      );
    }

    // If title is changing, check if new title already exists
    if (updateMovieDto.title !== title) {
      const existingMovie = await this.movieRepository.findByTitle(
        updateMovieDto.title,
      );
      if (existingMovie && existingMovie.id !== movie.id) {
        throw new EntityAlreadyExistsException(
          `Movie with title "${updateMovieDto.title}" already exists`,
        );
      }
    }

    // Update movie properties
    Object.assign(movie, updateMovieDto);
    await this.movieRepository.save(movie);
  }

  async removeByTitle(title: string): Promise<void> {
    const movie = await this.movieRepository.findByTitle(title);
    if (!movie) {
      throw new EntityNotFoundException(
        `Movie with title "${title}" not found`,
      );
    }

    await this.movieRepository.remove(movie);
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new EntityNotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }
}
