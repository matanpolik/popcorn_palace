import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { BookingRepository } from './repositories/booking.repository';
import { ShowtimeService } from '../showtimes/showtime.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from '../../common/exceptions/custom-exceptions';
import { ShowtimeResponseDto } from '../showtimes/dtos/response-showtime.dto'; // Assuming this exists
import { getRepositoryToken } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid'; // Import uuid validator

describe('BookingService', () => {
  let bookingService: BookingService;
  let bookingRepository: Partial<BookingRepository>; // Use Partial for mocking
  let showtimeService: Partial<ShowtimeService>; // Use Partial for mocking

  const mockShowtimeId = 1;
  const mockSeatNumber = 15;
  const mockUserId = '84438967-f68f-4fa0-b620-0f08217e76af'; // Valid UUID
  const mockGeneratedBookingId = 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae'; // Example valid UUID

  const createBookingDto: CreateBookingDto = {
    showtimeId: mockShowtimeId,
    seatNumber: mockSeatNumber,
    userId: mockUserId,
  };

  const mockShowtime: ShowtimeResponseDto = {
    id: mockShowtimeId,
    price: 50,
    movieId: 1,
    theater: 'Theater A',
    startTime: new Date(),
    endTime: new Date(),
  };

  const mockBookingEntity: Booking = {
    bookingId: mockGeneratedBookingId,
    showtimeId: mockShowtimeId,
    seatNumber: mockSeatNumber,
    userId: mockUserId,
    showtime: {} as any, // Simplified mock relation
  };

  beforeEach(async () => {
    bookingRepository = {
      findByShowtimeAndSeat: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    showtimeService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(BookingRepository), // Use getRepositoryToken
          useValue: bookingRepository,
        },
        {
          provide: ShowtimeService,
          useValue: showtimeService,
        },
      ],
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(bookingService).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking successfully and return the booking entity with a UUID bookingId', async () => {
      // Arrange
      (showtimeService.findOne as jest.Mock).mockResolvedValue(mockShowtime);
      (bookingRepository.findByShowtimeAndSeat as jest.Mock).mockResolvedValue(
        null, // Seat is available
      );
      (bookingRepository.create as jest.Mock).mockReturnValue(
        mockBookingEntity,
      );
      (bookingRepository.save as jest.Mock).mockResolvedValue(
        mockBookingEntity,
      );

      const result = await bookingService.create(createBookingDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockBookingEntity); // Check the whole entity
      expect(result.bookingId).toBeDefined();
      expect(typeof result.bookingId).toBe('string');
      expect(isUUID(result.bookingId)).toBe(true); // Validate that bookingId is a UUID
      expect(showtimeService.findOne).toHaveBeenCalledWith(mockShowtimeId);
      expect(bookingRepository.findByShowtimeAndSeat).toHaveBeenCalledWith(
        mockShowtimeId,
        mockSeatNumber,
      );
      expect(bookingRepository.create).toHaveBeenCalledWith({
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
        userId: createBookingDto.userId,
      });
      expect(bookingRepository.save).toHaveBeenCalledWith(mockBookingEntity);
    });

    it('should throw EntityNotFoundException if the showtime does not exist', async () => {
      (showtimeService.findOne as jest.Mock).mockResolvedValue(null); // Simulate showtime not found
      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        EntityNotFoundException,
      );
      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        `Showtime not found`,
      );
      expect(showtimeService.findOne).toHaveBeenCalledWith(mockShowtimeId);
      expect(bookingRepository.findByShowtimeAndSeat).not.toHaveBeenCalled();
      expect(bookingRepository.create).not.toHaveBeenCalled();
      expect(bookingRepository.save).not.toHaveBeenCalled();
    });

    it('should throw EntityAlreadyExistsException if the seat is already booked for the showtime', async () => {
      const existingBooking = {
        ...mockBookingEntity,
        bookingId: 'another-uuid',
      };
      (showtimeService.findOne as jest.Mock).mockResolvedValue(mockShowtime);
      (bookingRepository.findByShowtimeAndSeat as jest.Mock).mockResolvedValue(
        existingBooking, // Simulate seat already booked
      );

      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        EntityAlreadyExistsException,
      );
      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        `Seat ${mockSeatNumber} is already booked for this showtime`, // Check the specific error message
      );
      expect(showtimeService.findOne).toHaveBeenCalledWith(mockShowtimeId);
      expect(bookingRepository.findByShowtimeAndSeat).toHaveBeenCalledWith(
        mockShowtimeId,
        mockSeatNumber,
      );
      expect(bookingRepository.create).not.toHaveBeenCalled();
      expect(bookingRepository.save).not.toHaveBeenCalled();
    });

    // Optional: Test if showtimeService.findOne throws an error
    it('should propagate EntityNotFoundException if showtimeService.findOne throws it', async () => {
      const errorMessage = `Showtime with ID ${mockShowtimeId} not found`;
      (showtimeService.findOne as jest.Mock).mockRejectedValue(
        new EntityNotFoundException(errorMessage),
      );

      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        EntityNotFoundException,
      );
      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        errorMessage,
      );
      expect(showtimeService.findOne).toHaveBeenCalledWith(mockShowtimeId);
      expect(bookingRepository.findByShowtimeAndSeat).not.toHaveBeenCalled();
      expect(bookingRepository.create).not.toHaveBeenCalled();
      expect(bookingRepository.save).not.toHaveBeenCalled();
    });
  });
});
