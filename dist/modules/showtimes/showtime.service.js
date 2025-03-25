"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimeService = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("../../common/exceptions/custom-exceptions");
const movie_service_1 = require("../movies/movie.service");
const showtime_repository_1 = require("./repositories/showtime.repository");
let ShowtimeService = class ShowtimeService {
    constructor(showtimeRepository, movieService) {
        this.showtimeRepository = showtimeRepository;
        this.movieService = movieService;
    }
    async findOne(id) {
        const showtime = await this.showtimeRepository.findByIdWithRelations(id);
        if (!showtime) {
            throw new custom_exceptions_1.EntityNotFoundException(`Showtime with ID ${id} not found`);
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
    async create(createShowtimeDto) {
        await this.movieService.findOne(createShowtimeDto.movieId);
        const startTime = new Date(createShowtimeDto.startTime);
        const endTime = new Date(createShowtimeDto.endTime);
        if (startTime >= endTime) {
            throw new custom_exceptions_1.ValidationFailedException('End time must be after start time');
        }
        const overlappingShowtimes = await this.showtimeRepository.findOverlappingShowtimes(createShowtimeDto.theater, startTime, endTime);
        if (overlappingShowtimes.length > 0) {
            throw new custom_exceptions_1.EntityAlreadyExistsException(`There is an overlapping showtime in ${createShowtimeDto.theater} at the specified time`);
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
    async update(id, updateShowtimeDto) {
        const showtime = await this.findOne(id);
        if (updateShowtimeDto.movieId !== showtime.movieId) {
            await this.movieService.findOne(updateShowtimeDto.movieId);
        }
        Object.assign(showtime, updateShowtimeDto);
        await this.showtimeRepository.save(showtime);
    }
    async remove(id) {
        const result = await this.showtimeRepository.delete(id);
        if (result.affected === 0) {
            throw new custom_exceptions_1.EntityNotFoundException(`Showtime with ID ${id} not found`);
        }
    }
};
exports.ShowtimeService = ShowtimeService;
exports.ShowtimeService = ShowtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [showtime_repository_1.ShowtimeRepository,
        movie_service_1.MovieService])
], ShowtimeService);
//# sourceMappingURL=showtime.service.js.map