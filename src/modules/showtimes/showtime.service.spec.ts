import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeService } from './showtime.service';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { MovieService } from '../movies/movie.service';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  ValidationFailedException,
} from '../../common/exceptions/custom-exceptions';
import { Movie } from '../movies/entities/movie.entity';
import { ShowtimeResponseDto } from './dtos/response-showtime.dto';

describe('ShowtimeService', () => {
  let showtimeService: ShowtimeService;
  let showtimeRepository: Partial<ShowtimeRepository>; // Use Partial
  let movieService: Partial<MovieService>; // Use Partial

  beforeEach(async () => {
    // Mock ShowtimeRepository
    showtimeRepository = {
      findByIdWithRelations: jest.fn(),
      findOverlappingShowtimes: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    // Mock MovieService
    movieService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        { provide: ShowtimeRepository, useValue: showtimeRepository },
        { provide: MovieService, useValue: movieService },
      ],
    }).compile();

    showtimeService = module.get<ShowtimeService>(ShowtimeService);
  });

  it('should be defined', () => {
    expect(showtimeService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a showtime DTO if found', async () => {
      const showtimeId = 1;
      const mockShowtimeEntity = {
        id: showtimeId,
        price: 50.2,
        movieId: 101,
        theater: 'Sample Theater',
        startTime: new Date('2025-02-14T11:47:46.125Z'),
        endTime: new Date('2025-02-14T14:47:46.125Z'),
      };

      const expectedShowtimeDto: ShowtimeResponseDto = {
        id: showtimeId,
        price: 50.2,
        movieId: 101,
        theater: 'Sample Theater',
        startTime: new Date('2025-02-14T11:47:46.125Z'),
        endTime: new Date('2025-02-14T14:47:46.125Z'),
      };

      (showtimeRepository.findByIdWithRelations as jest.Mock).mockResolvedValue(
        mockShowtimeEntity,
      );

      const result = await showtimeService.findOne(showtimeId);

      expect(result).toEqual(expectedShowtimeDto);
      expect(showtimeRepository.findByIdWithRelations).toHaveBeenCalledWith(
        showtimeId,
      );
    });

    it('should throw EntityNotFoundException if showtime is not found', async () => {
      (showtimeRepository.findByIdWithRelations as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(showtimeService.findOne(1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('create', () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      price: 10.5,
      theater: 'Theater 1',
      startTime: new Date('2025-02-14T15:00:00.000Z'), // Valid time
      endTime: new Date('2025-02-14T18:00:00.000Z'), // Valid time
    };

    it('should create a showtime successfully', async () => {
      const mockMovie: Movie = { id: 1 } as Movie;
      (movieService.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (
        showtimeRepository.findOverlappingShowtimes as jest.Mock
      ).mockResolvedValue([]);
      const createdShowtime = { ...createShowtimeDto, id: 1 } as Showtime;
      (showtimeRepository.create as jest.Mock).mockReturnValue(createdShowtime);
      (showtimeRepository.save as jest.Mock).mockResolvedValue(createdShowtime);

      const result = await showtimeService.create(createShowtimeDto);

      expect(result).toEqual(createdShowtime);
      expect(movieService.findOne).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(showtimeRepository.findOverlappingShowtimes).toHaveBeenCalledWith(
        createShowtimeDto.theater,
        new Date(createShowtimeDto.startTime),
        new Date(createShowtimeDto.endTime),
      );
      expect(showtimeRepository.create).toHaveBeenCalled();
      expect(showtimeRepository.save).toHaveBeenCalledWith(createdShowtime);
    });

    it('should throw ValidationFailedException if endTime is before startTime', async () => {
      const invalidDto = {
        ...createShowtimeDto,
        startTime: new Date('2025-02-14T18:00:00.000Z'), // Invalid: endTime is before startTime
        endTime: new Date('2025-02-14T15:00:00.000Z'),
      };

      await expect(showtimeService.create(invalidDto)).rejects.toThrow(
        ValidationFailedException,
      );
    });

    it('should throw EntityAlreadyExistsException if there is an overlapping showtime', async () => {
      const mockMovie: Movie = { id: 1, title: 'Movie 1' } as Movie;

      (movieService.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (
        showtimeRepository.findOverlappingShowtimes as jest.Mock
      ).mockResolvedValue([{ id: 2 }]); // Simulate overlapping showtime

      await expect(showtimeService.create(createShowtimeDto)).rejects.toThrow(
        EntityAlreadyExistsException,
      );
      expect(movieService.findOne).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(showtimeRepository.findOverlappingShowtimes).toHaveBeenCalled();
    });
    it('should throw EntityNotFoundException if the movie does not exist', async () => {
      (movieService.findOne as jest.Mock).mockRejectedValue(
        new EntityNotFoundException('Movie not found'),
      );

      await expect(showtimeService.create(createShowtimeDto)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(movieService.findOne).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
    });
  });

  describe('update', () => {
    const updateShowtimeDto: CreateShowtimeDto = {
      movieId: 2, // Different movie ID
      price: 12.5,
      theater: 'Theater 2',
      startTime: new Date('2024-03-15T14:00:00.000Z'),
      endTime: new Date('2024-03-15T17:00:00.000Z'),
    };

    it('should update a showtime successfully', async () => {
      const existingShowtime = { id: 1, movieId: 1 } as Showtime;
      const mockMovie: Movie = { id: 2, title: 'Movie 2' } as Movie;

      (showtimeRepository.findByIdWithRelations as jest.Mock).mockResolvedValue(
        existingShowtime,
      );
      (movieService.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (showtimeRepository.save as jest.Mock).mockResolvedValue({
        ...existingShowtime,
        ...updateShowtimeDto,
      });

      await showtimeService.update(1, updateShowtimeDto);

      expect(showtimeRepository.findByIdWithRelations).toHaveBeenCalledWith(1);
      expect(movieService.findOne).toHaveBeenCalledWith(
        updateShowtimeDto.movieId,
      );
      expect(showtimeRepository.save).toHaveBeenCalledWith({
        id: 1,
        movieId: 2,
        price: 12.5,
        theater: 'Theater 2',
        startTime: new Date('2024-03-15T14:00:00.000Z'),
        endTime: new Date('2024-03-15T17:00:00.000Z'),
      });
    });

    it('should throw EntityNotFoundException if showtime is not found', async () => {
      (showtimeRepository.findByIdWithRelations as jest.Mock).mockResolvedValue(
        null,
      );
      await expect(
        showtimeService.update(1, updateShowtimeDto),
      ).rejects.toThrow(EntityNotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a showtime successfully', async () => {
      (showtimeRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await showtimeService.remove(1);

      expect(showtimeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw EntityNotFoundException if showtime is not found', async () => {
      (showtimeRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      await expect(showtimeService.remove(1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });
});
