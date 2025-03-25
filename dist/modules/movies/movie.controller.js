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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const movie_service_1 = require("./movie.service");
const create_movie_dto_1 = require("./dtos/create-movie.dto");
const movie_entity_1 = require("./entities/movie.entity");
let MovieController = class MovieController {
    constructor(movieService) {
        this.movieService = movieService;
    }
    async findAll() {
        return await this.movieService.findAll();
    }
    async create(createMovieDto) {
        return await this.movieService.create(createMovieDto);
    }
    async update(movieTitle, updateMovieDto) {
        return await this.movieService.updateByTitle(movieTitle, updateMovieDto);
    }
    async remove(movieTitle) {
        return await this.movieService.removeByTitle(movieTitle);
    }
};
exports.MovieController = MovieController;
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all movies' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all movies',
        type: [movie_entity_1.Movie],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a movie' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Movie created successfully',
        type: movie_entity_1.Movie,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movie_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update/:movieTitle'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('movieTitle')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_movie_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':movieTitle'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie deleted successfully' }),
    __param(0, (0, common_1.Param)('movieTitle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "remove", null);
exports.MovieController = MovieController = __decorate([
    (0, swagger_1.ApiTags)('movies'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], MovieController);
//# sourceMappingURL=movie.controller.js.map