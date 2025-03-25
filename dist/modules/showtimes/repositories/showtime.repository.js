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
exports.ShowtimeRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const showtime_entity_1 = require("../entities/showtime.entity");
let ShowtimeRepository = class ShowtimeRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(showtime_entity_1.Showtime, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByIdWithRelations(id) {
        return this.findOne({
            where: { id },
        });
    }
    async findOverlappingShowtimes(theater, startTime, endTime, excludeId) {
        const query = this.createQueryBuilder('showtime')
            .where('showtime.theater = :theater', { theater })
            .andWhere('((showtime.start_time <= :endTime) AND (showtime.end_time >= :startTime))', { startTime, endTime });
        if (excludeId) {
            query.andWhere('showtime.id != :excludeId', { excludeId });
        }
        return query.getMany();
    }
};
exports.ShowtimeRepository = ShowtimeRepository;
exports.ShowtimeRepository = ShowtimeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ShowtimeRepository);
//# sourceMappingURL=showtime.repository.js.map