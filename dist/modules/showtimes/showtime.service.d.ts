import { CreateShowtimeDto } from './dtos/create-showtime.dto';
import { MovieService } from '../movies/movie.service';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { ShowtimeResponseDto } from './dtos/response-showtime.dto';
export declare class ShowtimeService {
    private readonly showtimeRepository;
    private readonly movieService;
    constructor(showtimeRepository: ShowtimeRepository, movieService: MovieService);
    findOne(id: number): Promise<ShowtimeResponseDto>;
    create(createShowtimeDto: CreateShowtimeDto): Promise<ShowtimeResponseDto>;
    update(id: number, updateShowtimeDto: CreateShowtimeDto): Promise<void>;
    remove(id: number): Promise<void>;
}
