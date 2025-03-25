import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust path to your main AppModule
import { DataSource } from 'typeorm';
import { validate as isUUID } from 'uuid'; // Import uuid validator

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let httpServer: any; // To use with supertest agent
  const testUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Consistent test user ID

  const getTestTimes = (offsetHoursStart: number, offsetHoursEnd: number) => {
    const now = Date.now();
    const startTime = new Date(now + offsetHoursStart * 60 * 60 * 1000);
    const endTime = new Date(now + offsetHoursEnd * 60 * 60 * 1000);
    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  };

  // --- Test Data ---
  const movieData1 = {
    title: 'E2E Test Movie Alpha',
    genre: 'Action',
    duration: 125,
    rating: 8.5,
    releaseYear: 2025,
  };
  const movieData2 = {
    title: 'E2E Test Movie Beta',
    genre: 'Comedy',
    duration: 98,
    rating: 7.1,
    releaseYear: 2024,
  };
  const movieUpdateData = {
    title: 'E2E Updated Movie Alpha',
    genre: 'Action Thriller',
    duration: 130,
    rating: 8.8,
    releaseYear: 2025,
  };

  // --- Test Setup & Teardown ---

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import your main AppModule
    }).compile();

    app = moduleFixture.createNestApplication();
    // Apply the same validation pipe used in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
    dataSource = moduleFixture.get<DataSource>(DataSource); // Get DataSource for cleanup
  });

  // Clean the database using synchronize(true) before each test
  beforeEach(async () => {
    console.log('--- Running beforeEach Cleanup (synchronize) ---');
    try {
      await dataSource.synchronize(true); // Drop and recreate schema
      console.log('--- Finished beforeEach Cleanup (synchronize) ---');
    } catch (error) {
      console.error('ERROR during beforeEach synchronize:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy(); // Cleanly close DB connection
    }
    await app.close();
  });

  // ==================================
  // Test Suite Start
  // ==================================

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  // --- Movie Management Flow ---
  describe('Movie Management Flow', () => {
    it('POST /movies - should add a new movie successfully', async () => {
      const response = await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK); // Assuming 200 OK based on your spec

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toEqual(movieData1.title);
      expect(response.body.genre).toEqual(movieData1.genre);
      expect(response.body.duration).toEqual(movieData1.duration);
      expect(response.body.rating).toEqual(movieData1.rating);
      expect(response.body.releaseYear).toEqual(movieData1.releaseYear);
    });

    it('GET /movies/all - should return an empty array when no movies exist', async () => {
      // DB is clean due to beforeEach
      const response = await request(httpServer)
        .get('/movies/all')
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('GET /movies/all - should return all created movies', async () => {
      // Add movies within this test
      await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);
      await request(httpServer)
        .post('/movies')
        .send(movieData2)
        .expect(HttpStatus.OK);

      const response = await request(httpServer)
        .get('/movies/all')
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      const titles = response.body.map((m) => m.title);
      expect(titles).toContain(movieData1.title);
      expect(titles).toContain(movieData2.title);
    });

    it('POST /movies - should fail to add a movie with a duplicate title (409 Conflict)', async () => {
      // Step 1: Create the first movie
      await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);

      // Step 2: Attempt to create the same movie again
      await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.CONFLICT); // 409
    });

    it('POST /movies/update/:movieTitle - should update an existing movie and return 200 OK', async () => {
      // Step 1: Create the movie to be updated
      const createResponse = await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);
      const originalTitle = createResponse.body.title;
      const movieId = createResponse.body.id;

      // Step 2: Update the movie
      await request(httpServer)
        .post(`/movies/update/${encodeURIComponent(originalTitle)}`)
        .send(movieUpdateData)
        .expect(HttpStatus.OK);

      // Step 3: Verify the update by fetching all (since GET by title isn't available)
      const getResponse = await request(httpServer)
        .get('/movies/all')
        .expect(HttpStatus.OK);
      const updatedMovie = getResponse.body.find((m) => m.id === movieId); // Find by ID
      expect(updatedMovie).toBeDefined();
      expect(updatedMovie.title).toEqual(movieUpdateData.title);
      expect(updatedMovie.genre).toEqual(movieUpdateData.genre);
      expect(updatedMovie.duration).toEqual(movieUpdateData.duration);
      expect(updatedMovie.rating).toEqual(movieUpdateData.rating);
    });

    it('POST /movies/update/:movieTitle - should fail to update a movie to an existing title (409 Conflict)', async () => {
      // Step 1: Create two distinct movies
      await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);
      await request(httpServer)
        .post('/movies')
        .send(movieData2)
        .expect(HttpStatus.OK);

      // Step 2: Try to update movie 1 to movie 2's title
      await request(httpServer)
        .post(`/movies/update/${encodeURIComponent(movieData1.title)}`)
        .send({ ...movieUpdateData, title: movieData2.title }) // Use movie 2's title
        .expect(HttpStatus.CONFLICT); // 409
    });

    it('POST /movies/update/:movieTitle - should fail to update a non-existent movie (404 Not Found)', async () => {
      // DB is clean, no movie exists
      await request(httpServer)
        .post(`/movies/update/NonExistentMovie123`)
        .send(movieUpdateData)
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('DELETE /movies/:movieTitle - should delete an existing movie and return 200 OK', async () => {
      // Step 1: Create the movie to be deleted
      await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);

      // Step 2: Delete the movie
      await request(httpServer)
        .delete(`/movies/${encodeURIComponent(movieData1.title)}`)
        .expect(HttpStatus.OK);

      // Step 3: Verify deletion by fetching all
      const getResponse = await request(httpServer)
        .get('/movies/all')
        .expect(HttpStatus.OK);
      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body).toHaveLength(0);
    });

    it('DELETE /movies/:movieTitle - should fail to delete a non-existent movie (404 Not Found)', async () => {
      // DB is clean
      await request(httpServer)
        .delete(`/movies/NonExistentMovie123`)
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('POST /movies - should fail validation for invalid input (400 Bad Request)', async () => {
      await request(httpServer)
        .post('/movies')
        .send({ title: 'Only Title' }) // Missing other required fields
        .expect(HttpStatus.BAD_REQUEST); // 400

      await request(httpServer)
        .post('/movies')
        .send({ ...movieData1, duration: -100 }) // Invalid duration
        .expect(HttpStatus.BAD_REQUEST); // 400

      await request(httpServer)
        .post('/movies')
        .send({ ...movieData1, rating: 11 }) // Invalid rating
        .expect(HttpStatus.BAD_REQUEST); // 400
    });
  }); // End Movie Management Flow

  // --- Showtime Management Flow ---
  describe('Showtime Management Flow', () => {
    let testMovieId: number; // Store movie ID created for showtime tests

    // Helper to create a movie before tests that need one
    const createTestMovie = async () => {
      const response = await request(httpServer)
        .post('/movies')
        .send(movieData1)
        .expect(HttpStatus.OK);
      return response.body.id;
    };

    it('POST /showtimes - should add a new showtime successfully', async () => {
      testMovieId = await createTestMovie(); // Create movie for this test
      const { startTime, endTime } = getTestTimes(1, 3); // 1hr to 3hr from now
      const showtimeData = {
        movieId: testMovieId,
        price: 15.5,
        theater: 'E2E Theater Alpha',
        startTime: startTime,
        endTime: endTime,
      };

      const response = await request(httpServer)
        .post('/showtimes')
        .send(showtimeData)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.movieId).toEqual(testMovieId);
      expect(response.body.theater).toEqual(showtimeData.theater);
      expect(response.body.price).toEqual(showtimeData.price);
      // Compare dates carefully, potentially ignoring milliseconds if needed
      expect(new Date(response.body.startTime).toISOString()).toEqual(
        startTime,
      );
      expect(new Date(response.body.endTime).toISOString()).toEqual(endTime);
    });

    it('GET /showtimes/:showtimeId - should get a created showtime by ID', async () => {
      testMovieId = await createTestMovie();
      const { startTime, endTime } = getTestTimes(1, 3);
      const showtimeData = {
        movieId: testMovieId,
        price: 15.5,
        theater: 'E2E Theater Beta',
        startTime,
        endTime,
      };
      const createResponse = await request(httpServer)
        .post('/showtimes')
        .send(showtimeData)
        .expect(HttpStatus.OK);
      const showtimeId = createResponse.body.id;

      const response = await request(httpServer)
        .get(`/showtimes/${showtimeId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(showtimeId);
      expect(response.body.movieId).toEqual(testMovieId);
      expect(response.body.theater).toEqual(showtimeData.theater);
    });

    it('POST /showtimes - should fail to add a showtime for a non-existent movie (404 Not Found)', async () => {
      // Don't create a movie
      const { startTime, endTime } = getTestTimes(1, 3);
      const nonExistentMovieId = 999999;
      await request(httpServer)
        .post('/showtimes')
        .send({
          movieId: nonExistentMovieId,
          price: 10,
          theater: 'Ghost Theater',
          startTime,
          endTime,
        })
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('POST /showtimes - should fail validation for invalid times (endTime before startTime) (400 Bad Request)', async () => {
      testMovieId = await createTestMovie();
      const { startTime, endTime } = getTestTimes(3, 1); // End time before start time
      await request(httpServer)
        .post('/showtimes')
        .send({
          movieId: testMovieId,
          price: 10,
          theater: 'Time Warp Theater',
          startTime,
          endTime,
        })
        .expect(HttpStatus.BAD_REQUEST); // 400 - Should be caught by ValidationFailedException
    });

    it('POST /showtimes - should fail to add an overlapping showtime in the same theater (409 Conflict)', async () => {
      testMovieId = await createTestMovie();
      const theater = 'E2E Overlap Theater';
      const times1 = getTestTimes(1, 3); // 1-3 PM
      const times2 = getTestTimes(2, 4); // 2-4 PM (overlaps)

      // Create the first showtime
      await request(httpServer)
        .post('/showtimes')
        .send({ movieId: testMovieId, price: 10, theater: theater, ...times1 })
        .expect(HttpStatus.OK);

      // Attempt to create the overlapping showtime
      await request(httpServer)
        .post('/showtimes')
        .send({ movieId: testMovieId, price: 12, theater: theater, ...times2 }) // Same theater, overlapping time
        .expect(HttpStatus.CONFLICT); // 409
    });

    it('POST /showtimes - should allow non-overlapping showtimes in the same theater', async () => {
      testMovieId = await createTestMovie();
      const theater = 'E2E Non-Overlap Theater';
      const times1 = getTestTimes(1, 3); // 1-3 PM
      const times2 = getTestTimes(4, 6); // 4-6 PM (no overlap)

      // Create the first showtime
      await request(httpServer)
        .post('/showtimes')
        .send({ movieId: testMovieId, price: 10, theater: theater, ...times1 })
        .expect(HttpStatus.OK);

      // Attempt to create the non-overlapping showtime
      await request(httpServer)
        .post('/showtimes')
        .send({ movieId: testMovieId, price: 12, theater: theater, ...times2 })
        .expect(HttpStatus.OK); // Should succeed
    });

    it('POST /showtimes/update/:showtimeId - should update an existing showtime', async () => {
      testMovieId = await createTestMovie();
      const { startTime, endTime } = getTestTimes(1, 3);
      const showtimeData = {
        movieId: testMovieId,
        price: 15.5,
        theater: 'E2E Theater Gamma',
        startTime,
        endTime,
      };
      const createResponse = await request(httpServer)
        .post('/showtimes')
        .send(showtimeData)
        .expect(HttpStatus.OK);
      const showtimeId = createResponse.body.id;

      const updatedTimes = getTestTimes(2, 4);
      const updateData = {
        movieId: testMovieId, // Can keep same or change if another movie exists
        price: 18.99,
        theater: 'E2E Theater Gamma Updated',
        ...updatedTimes,
      };

      await request(httpServer)
        .post(`/showtimes/update/${showtimeId}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      // Verify update
      const getResponse = await request(httpServer)
        .get(`/showtimes/${showtimeId}`)
        .expect(HttpStatus.OK);
      expect(getResponse.body.price).toEqual(updateData.price);
      expect(getResponse.body.theater).toEqual(updateData.theater);
      expect(new Date(getResponse.body.startTime).toISOString()).toEqual(
        updatedTimes.startTime,
      );
    });

    it('POST /showtimes/update/:showtimeId - should fail to update a non-existent showtime (404 Not Found)', async () => {
      const nonExistentShowtimeId = 99999;
      const { startTime, endTime } = getTestTimes(1, 3);
      // Don't need to create a movie as the showtime doesn't exist anyway
      await request(httpServer)
        .post(`/showtimes/update/${nonExistentShowtimeId}`)
        .send({
          movieId: 1,
          price: 10,
          theater: 'Phantom Theater',
          startTime,
          endTime,
        })
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('DELETE /showtimes/:showtimeId - should delete an existing showtime', async () => {
      testMovieId = await createTestMovie();
      const { startTime, endTime } = getTestTimes(1, 3);
      const showtimeData = {
        movieId: testMovieId,
        price: 15.5,
        theater: 'E2E Theater Delta',
        startTime,
        endTime,
      };
      const createResponse = await request(httpServer)
        .post('/showtimes')
        .send(showtimeData)
        .expect(HttpStatus.OK);
      const showtimeId = createResponse.body.id;

      // Delete it
      await request(httpServer)
        .delete(`/showtimes/${showtimeId}`)
        .expect(HttpStatus.OK);

      // Verify deletion
      await request(httpServer)
        .get(`/showtimes/${showtimeId}`)
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('DELETE /showtimes/:showtimeId - should fail to delete a non-existent showtime (404 Not Found)', async () => {
      const nonExistentShowtimeId = 99999;
      await request(httpServer)
        .delete(`/showtimes/${nonExistentShowtimeId}`)
        .expect(HttpStatus.NOT_FOUND); // 404
    });
  }); // End Showtime Management Flow

  // --- Booking Management Flow ---
  describe('Booking Management Flow', () => {
    // Helper to create movie and showtime for booking tests
    const setupBookingPrerequisites = async () => {
      const movieRes = await request(httpServer)
        .post('/movies')
        .send({
          title: 'Booking Movie Epsilon',
          genre: 'Drama',
          duration: 115,
          rating: 7.9,
          releaseYear: 2024,
        })
        .expect(HttpStatus.OK);
      const movieId = movieRes.body.id;

      const { startTime, endTime } = getTestTimes(2, 4.5); // Show starts in 2 hrs, ends in 4.5 hrs
      const showtimeRes = await request(httpServer)
        .post('/showtimes')
        .send({
          movieId: movieId,
          price: 22.5,
          theater: 'E2E Booking Hall',
          startTime,
          endTime,
        })
        .expect(HttpStatus.OK);
      const showtimeId = showtimeRes.body.id;
      return { movieId, showtimeId };
    };

    it('POST /bookings - should successfully book a ticket for an available seat', async () => {
      const { showtimeId } = await setupBookingPrerequisites(); // Setup movie/showtime
      const seatToBook = 5;

      const bookingData = {
        showtimeId,
        seatNumber: seatToBook,
        userId: testUserId,
      };

      const response = await request(httpServer)
        .post('/bookings')
        .send(bookingData)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.bookingId).toBeDefined();
      expect(isUUID(response.body.bookingId)).toBe(true); // Validate UUID format
    });

    it('POST /bookings - should fail to book the SAME seat again for the SAME showtime (409 Conflict)', async () => {
      const { showtimeId } = await setupBookingPrerequisites();
      const seatToBook = 5;

      // Step 1: Book the seat successfully
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: seatToBook, userId: testUserId })
        .expect(HttpStatus.OK);

      // Step 2: Attempt to book the same seat again (can be same or different user)
      await request(httpServer)
        .post('/bookings')
        .send({
          showtimeId,
          seatNumber: seatToBook,
          userId: '11111111-2222-3333-4444-555555555555',
        })
        .expect(HttpStatus.CONFLICT); // 409
    });

    it('POST /bookings - should successfully book a DIFFERENT seat for the SAME showtime', async () => {
      const { showtimeId } = await setupBookingPrerequisites();
      const seat1 = 5;
      const seat2 = 10;

      // Step 1: Book the first seat (optional, but shows sequence)
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: seat1, userId: testUserId })
        .expect(HttpStatus.OK);

      // Step 2: Book the second, different seat
      const response = await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: seat2, userId: testUserId }) // Different seat
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.bookingId).toBeDefined();
      expect(isUUID(response.body.bookingId)).toBe(true);
    });

    it('POST /bookings - should fail to book a seat for a non-existent showtime (404 Not Found)', async () => {
      // Don't need to run setupBookingPrerequisites() as showtime shouldn't exist
      const nonExistentShowtimeId = 88888;
      await request(httpServer)
        .post('/bookings')
        .send({
          showtimeId: nonExistentShowtimeId,
          seatNumber: 1,
          userId: testUserId,
        })
        .expect(HttpStatus.NOT_FOUND); // 404
    });

    it('POST /bookings - should fail validation for invalid input (400 Bad Request)', async () => {
      const { showtimeId } = await setupBookingPrerequisites(); // Need a valid showtimeId for some cases

      // Missing seatNumber
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, userId: testUserId })
        .expect(HttpStatus.BAD_REQUEST);

      // Invalid userId format
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: 20, userId: 'not-a-uuid' })
        .expect(HttpStatus.BAD_REQUEST);

      // Invalid seatNumber (e.g., zero or negative)
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: 0, userId: testUserId })
        .expect(HttpStatus.BAD_REQUEST);

      // Missing showtimeId
      await request(httpServer)
        .post('/bookings')
        .send({ seatNumber: 1, userId: testUserId })
        .expect(HttpStatus.BAD_REQUEST);

      // Missing userId
      await request(httpServer)
        .post('/bookings')
        .send({ showtimeId, seatNumber: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
