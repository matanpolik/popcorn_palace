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
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../core/abstracts/base.entity");
let Movie = class Movie extends base_entity_1.BaseEntity {
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Movie.prototype, "genre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Movie.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 1 }),
    __metadata("design:type", Number)
], Movie.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'release_year' }),
    __metadata("design:type", Number)
], Movie.prototype, "releaseYear", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)('movies')
], Movie);
//# sourceMappingURL=movie.entity.js.map