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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const booking_repository_1 = require("./repositories/booking.repository");
const custom_exceptions_1 = require("../../common/exceptions/custom-exceptions");
const showtime_service_1 = require("../showtimes/showtime.service");
const typeorm_1 = require("@nestjs/typeorm");
let BookingService = class BookingService {
    constructor(bookingRepository, showtimeService) {
        this.bookingRepository = bookingRepository;
        this.showtimeService = showtimeService;
    }
    async create(createBookingDto) {
        const showtime = await this.showtimeService.findOne(createBookingDto.showtimeId);
        if (!showtime) {
            throw new custom_exceptions_1.EntityNotFoundException(`Showtime not found`);
        }
        const existingBooking = await this.bookingRepository.findByShowtimeAndSeat(createBookingDto.showtimeId, createBookingDto.seatNumber);
        if (existingBooking) {
            throw new custom_exceptions_1.EntityAlreadyExistsException(`Seat ${createBookingDto.seatNumber} is already booked for this showtime`);
        }
        const booking = this.bookingRepository.create({
            showtimeId: createBookingDto.showtimeId,
            seatNumber: createBookingDto.seatNumber,
            userId: createBookingDto.userId,
        });
        return await this.bookingRepository.save(booking);
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_repository_1.BookingRepository)),
    __metadata("design:paramtypes", [booking_repository_1.BookingRepository,
        showtime_service_1.ShowtimeService])
], BookingService);
//# sourceMappingURL=booking.service.js.map