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
exports.Showtime = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../core/abstracts/base.entity");
let Showtime = class Showtime extends base_entity_1.BaseEntity {
};
exports.Showtime = Showtime;
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Showtime.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movie_id' }),
    __metadata("design:type", Number)
], Showtime.prototype, "movieId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Showtime.prototype, "theater", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Showtime.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Showtime.prototype, "endTime", void 0);
exports.Showtime = Showtime = __decorate([
    (0, typeorm_1.Entity)('showtimes')
], Showtime);
//# sourceMappingURL=showtime.entity.js.map