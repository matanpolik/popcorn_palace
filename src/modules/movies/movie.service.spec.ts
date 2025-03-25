import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { Movie } from './entities/movie.entity';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
} from '../../common/exceptions/custom-exceptions';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Partial<MovieRepository>;

  beforeEach(async () => {
    movieRepository = {
      findByTitle: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      findOne: jest.fn(),
      findAllWithPagination: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(MovieRepository),
          useValue: movieRepository,
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const mockMovies = [{ id: 1, title: 'Movie 1', rating: '8.5' }] as any;
      (movieRepository.findAllWithPagination as jest.Mock).mockResolvedValue([
        mockMovies,
        1,
      ]);

      const result = await movieService.findAll();
      expect(result).toEqual([{ ...mockMovies[0], rating: 8.5 }]);
      expect(movieRepository.findAllWithPagination).toHaveBeenCalled();
    });

    it('should return an empty array if no movies are found', async () => {
      (movieRepository.findAllWithPagination as jest.Mock).mockResolvedValue([
        [],
        0,
      ]);

      const result = await movieService.findAll();
      expect(result).toEqual([]);
      expect(movieRepository.findAllWithPagination).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'New Movie',
      genre: 'Action',
      duration: 120,
      rating: 9.0,
      releaseYear: 2024,
    };

    it('should create a movie successfully', async () => {
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue(null); // No existing movie
      const createdMovie = { ...createMovieDto, id: 1 } as Movie;
      (movieRepository.create as jest.Mock).mockReturnValue(createdMovie);
      (movieRepository.save as jest.Mock).mockResolvedValue(createdMovie);

      const result = await movieService.create(createMovieDto);

      expect(result).toEqual(createdMovie);
      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        createMovieDto.title,
      );
      expect(movieRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(movieRepository.save).toHaveBeenCalledWith(createdMovie);
    });

    it('should throw EntityAlreadyExistsException if movie with same title exists', async () => {
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'New Movie',
      }); // Existing movie

      await expect(movieService.create(createMovieDto)).rejects.toThrow(
        EntityAlreadyExistsException,
      );
      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        createMovieDto.title,
      );
    });
  });

  describe('updateByTitle', () => {
    const updateMovieDto: CreateMovieDto = {
      title: 'Updated Movie Title',
      genre: 'Comedy',
      duration: 110,
      rating: 7.5,
      releaseYear: 2023,
    };

    it('should update an existing movie successfully', async () => {
      const existingMovie: Partial<Movie> = {
        id: 1,
        title: 'Old Movie Title',
        ...updateMovieDto,
      }; // Use Partial<Movie>
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue(
        existingMovie,
      );
      (movieRepository.save as jest.Mock).mockResolvedValue(undefined); // save doesn't return anything on update

      await movieService.updateByTitle('Old Movie Title', updateMovieDto);

      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        'Old Movie Title',
      );
      expect(movieRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateMovieDto),
      );
    });

    it('should throw EntityNotFoundException if movie is not found', async () => {
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue(null);

      await expect(
        movieService.updateByTitle('Nonexistent Movie', updateMovieDto),
      ).rejects.toThrow(EntityNotFoundException);
      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        'Nonexistent Movie',
      );
    });

    it('should throw EntityAlreadyExistsException if updating to an existing title', async () => {
      const existingMovie: Partial<Movie> = {
        id: 1,
        title: 'Old Movie Title',
        ...updateMovieDto,
      }; // Use Partial
      const anotherMovie: Partial<Movie> = {
        id: 2,
        title: 'Updated Movie Title',
      };
      (movieRepository.findByTitle as jest.Mock).mockResolvedValueOnce(
        existingMovie,
      );
      (movieRepository.findByTitle as jest.Mock).mockResolvedValueOnce(
        anotherMovie,
      );

      await expect(
        movieService.updateByTitle('Old Movie Title', updateMovieDto),
      ).rejects.toThrow(EntityAlreadyExistsException);

      expect(movieRepository.findByTitle).toHaveBeenCalledTimes(2); // Important: Check how many times it's called
      expect(movieRepository.findByTitle).toHaveBeenNthCalledWith(
        1,
        'Old Movie Title',
      );
      expect(movieRepository.findByTitle).toHaveBeenNthCalledWith(
        2,
        updateMovieDto.title,
      );
    });
    it('should not throw EntityAlreadyExistsException if updating to the current title', async () => {
      const existingMovie: Movie = {
        id: 1,
        title: 'Old Movie Title',
        genre: 'Drama',
        duration: 100,
        rating: 8,
        releaseYear: 2022,
      } as Movie;
      const updateMovieDtoWithSameTitle: CreateMovieDto = {
        ...updateMovieDto,
        title: 'Old Movie Title',
      }; // Keep same title

      (movieRepository.findByTitle as jest.Mock).mockResolvedValue(
        existingMovie,
      );
      (movieRepository.save as jest.Mock).mockResolvedValue(undefined);

      await movieService.updateByTitle(
        'Old Movie Title',
        updateMovieDtoWithSameTitle,
      );

      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        'Old Movie Title',
      );
      expect(movieRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingMovie,
          ...updateMovieDtoWithSameTitle,
        }),
      );
    });
  });

  describe('removeByTitle', () => {
    it('should remove an existing movie successfully', async () => {
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue({ id: 1 }); // Simulate found movie
      (movieRepository.remove as jest.Mock).mockResolvedValue(undefined); // remove doesn't return anything

      await movieService.removeByTitle('Movie Title');

      expect(movieRepository.findByTitle).toHaveBeenCalledWith('Movie Title');
      expect(movieRepository.remove).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw EntityNotFoundException if movie is not found', async () => {
      (movieRepository.findByTitle as jest.Mock).mockResolvedValue(null);

      await expect(
        movieService.removeByTitle('Nonexistent Movie'),
      ).rejects.toThrow(EntityNotFoundException);
      expect(movieRepository.findByTitle).toHaveBeenCalledWith(
        'Nonexistent Movie',
      );
    });
  });

  describe('findOne', () => {
    it('should return a movie if found', async () => {
      const mockMovie = { id: 1, title: 'Movie 1' } as Movie;
      (movieRepository.findOne as jest.Mock).mockResolvedValue(mockMovie);
      const result = await movieService.findOne(1);

      expect(result).toEqual(mockMovie);
      expect(movieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
    it('shold throw EntityNotFoundException if not found', async () => {
      (movieRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(movieService.findOne(1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });
});
