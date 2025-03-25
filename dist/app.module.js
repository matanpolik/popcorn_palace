"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const validation_schema_1 = require("./config/validation.schema");
const configuration_1 = require("./config/configuration");
const database_module_1 = require("./core/database/database.module");
const movie_module_1 = require("./modules/movies/movie.module");
const showtime_module_1 = require("./modules/showtimes/showtime.module");
const booking_module_1 = require("./modules/bookings/booking.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: validation_schema_1.validationSchema,
            }),
            database_module_1.DatabaseModule,
            movie_module_1.MovieModule,
            showtime_module_1.ShowtimeModule,
            booking_module_1.BookingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map