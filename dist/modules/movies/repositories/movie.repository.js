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
exports.MovieRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const movie_entity_1 = require("../entities/movie.entity");
let MovieRepository = class MovieRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(movie_entity_1.Movie, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByTitle(title) {
        return this.findOne({ where: { title } });
    }
    async findAllWithPagination(page = 1, limit = 10) {
        return this.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'ASC',
            },
        });
    }
};
exports.MovieRepository = MovieRepository;
exports.MovieRepository = MovieRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MovieRepository);
//# sourceMappingURL=movie.repository.js.map