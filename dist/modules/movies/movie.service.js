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
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const movie_repository_1 = require("./repositories/movie.repository");
const custom_exceptions_1 = require("../../common/exceptions/custom-exceptions");
let MovieService = class MovieService {
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }
    async findAll() {
        const [movies] = await this.movieRepository.findAllWithPagination();
        return movies.map((movie) => ({
            ...movie,
            rating: Number(movie.rating),
        }));
    }
    async create(createMovieDto) {
        const existingMovie = await this.movieRepository.findByTitle(createMovieDto.title);
        if (existingMovie) {
            throw new custom_exceptions_1.EntityAlreadyExistsException(`Movie with title "${createMovieDto.title}" already exists`);
        }
        const movie = this.movieRepository.create(createMovieDto);
        const savedMovie = await this.movieRepository.save(movie);
        return {
            id: savedMovie.id,
            title: savedMovie.title,
            genre: savedMovie.genre,
            duration: savedMovie.duration,
            rating: Number(savedMovie.rating),
            releaseYear: savedMovie.releaseYear,
        };
    }
    async updateByTitle(title, updateMovieDto) {
        const movie = await this.movieRepository.findByTitle(title);
        if (!movie) {
            throw new custom_exceptions_1.EntityNotFoundException(`Movie with title "${title}" not found`);
        }
        if (updateMovieDto.title !== title) {
            const existingMovie = await this.movieRepository.findByTitle(updateMovieDto.title);
            if (existingMovie && existingMovie.id !== movie.id) {
                throw new custom_exceptions_1.EntityAlreadyExistsException(`Movie with title "${updateMovieDto.title}" already exists`);
            }
        }
        Object.assign(movie, updateMovieDto);
        await this.movieRepository.save(movie);
    }
    async removeByTitle(title) {
        const movie = await this.movieRepository.findByTitle(title);
        if (!movie) {
            throw new custom_exceptions_1.EntityNotFoundException(`Movie with title "${title}" not found`);
        }
        await this.movieRepository.remove(movie);
    }
    async findOne(id) {
        const movie = await this.movieRepository.findOne({ where: { id } });
        if (!movie) {
            throw new custom_exceptions_1.EntityNotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [movie_repository_1.MovieRepository])
], MovieService);
//# sourceMappingURL=movie.service.js.map