import { MovieService } from './movie.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    findAll(): Promise<import("./dtos/response-movie.dto").MovieResponseDto[]>;
    create(createMovieDto: CreateMovieDto): Promise<import("./dtos/response-movie.dto").MovieResponseDto>;
    update(movieTitle: string, updateMovieDto: CreateMovieDto): Promise<void>;
    remove(movieTitle: string): Promise<void>;
}
