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
exports.ShowtimeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const showtime_service_1 = require("./showtime.service");
const create_showtime_dto_1 = require("./dtos/create-showtime.dto");
const showtime_entity_1 = require("./entities/showtime.entity");
let ShowtimeController = class ShowtimeController {
    constructor(showtimeService) {
        this.showtimeService = showtimeService;
    }
    async findOne(showtimeId) {
        return await this.showtimeService.findOne(showtimeId);
    }
    async create(createShowtimeDto) {
        return await this.showtimeService.create(createShowtimeDto);
    }
    async update(showtimeId, updateShowtimeDto) {
        return await this.showtimeService.update(showtimeId, updateShowtimeDto);
    }
    async remove(showtimeId) {
        return await this.showtimeService.remove(showtimeId);
    }
};
exports.ShowtimeController = ShowtimeController;
__decorate([
    (0, common_1.Get)(':showtimeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get showtime by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Showtime found',
        type: showtime_entity_1.Showtime,
    }),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a showtime' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Showtime created successfully',
        type: showtime_entity_1.Showtime,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", Promise)
], ShowtimeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update/:showtimeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a showtime' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Showtime updated successfully' }),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", Promise)
], ShowtimeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':showtimeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a showtime' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Showtime deleted successfully' }),
    __param(0, (0, common_1.Param)('showtimeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimeController.prototype, "remove", null);
exports.ShowtimeController = ShowtimeController = __decorate([
    (0, swagger_1.ApiTags)('showtimes'),
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [showtime_service_1.ShowtimeService])
], ShowtimeController);
//# sourceMappingURL=showtime.controller.js.map