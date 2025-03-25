import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieResponseDto } from './dtos/response-movie.dto';
export declare class MovieService {
    private readonly movieRepository;
    constructor(movieRepository: MovieRepository);
    findAll(): Promise<MovieResponseDto[]>;
    create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto>;
    updateByTitle(title: string, updateMovieDto: CreateMovieDto): Promise<void>;
    removeByTitle(title: string): Promise<void>;
    findOne(id: number): Promise<Movie>;
}
