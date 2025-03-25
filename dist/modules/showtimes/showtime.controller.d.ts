import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';
export declare class ShowtimeController {
    private readonly showtimeService;
    constructor(showtimeService: ShowtimeService);
    findOne(showtimeId: number): Promise<import("./dtos/response-showtime.dto").ShowtimeResponseDto>;
    create(createShowtimeDto: CreateShowtimeDto): Promise<import("./dtos/response-showtime.dto").ShowtimeResponseDto>;
    update(showtimeId: number, updateShowtimeDto: CreateShowtimeDto): Promise<void>;
    remove(showtimeId: number): Promise<void>;
}
