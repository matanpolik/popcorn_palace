# Popcorn Palace API - Instructions

## Project Description

This document provides instructions for setting up, running, building, and testing the Popcorn Palace API. This is a backend application built with **NestJS** (a progressive Node.js framework) using **TypeScript**.

The application provides APIs for managing:

1.  **Movies:** Adding, updating, deleting, and retrieving movie information.
2.  **Showtimes:** Scheduling movie showtimes in specific theaters, including pricing and time slots, with checks for overlapping schedules.
3.  **Bookings:** Allowing users to book seats for specific showtimes, ensuring seats are not double-booked.

## Technologies Used

* **Backend Framework:** NestJS ([https://nestjs.com/](https://nestjs.com/))
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** TypeORM ([https://typeorm.io/](https://typeorm.io/)) for database interaction and schema management via migrations.
* **API Documentation:** Swagger (OpenAPI) automatically generated via NestJS decorators (usually accessible at `/api`).
* **Validation:** `class-validator` and `class-transformer` for request data validation and transformation.
* **Database Containerization:** Docker and Docker Compose are used to easily run the required PostgreSQL database instance in an isolated environment.
* **Testing:** Jest for unit and end-to-end (E2E) testing, `supertest` for E2E HTTP requests.


## Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(If you prefer yarn, use `yarn install`)*

3.  **Environment Variables:**
    * Create a `.env` file in the root of the project by copying the example file (if one exists, otherwise create it):
        ```bash
        # If .env.example exists:
        cp .env.example .env
        # Otherwise, create .env manually
        ```
    * Edit the `.env` file. It should contain at least the following database configuration, matching your `docker-compose.yml`:
        ```env
        # Application Port (Optional, defaults usually to 3000)
        PORT=3000

        # Database Configuration (PostgreSQL)
        DB_HOST=localhost
        DB_PORT=5432 # Matches the 'published' port in docker-compose.yml
        DB_USERNAME=popcorn-palace # Matches POSTGRES_USER in docker-compose.yml
        DB_PASSWORD=popcorn-palace # Matches POSTGRES_PASSWORD in docker-compose.yml
        DB_DATABASE=popcorn-palace # Matches POSTGRES_DB in docker-compose.yml

        # Alternatively, you might configure TypeORM using a single DATABASE_URL:
        # DATABASE_URL=postgresql://popcorn-palace:popcorn-palace@localhost:5432/popcorn-palace

        # Add any other required environment variables (e.g., JWT secrets)
        ```
    * **Important:** Ensure the database credentials in your `.env` file match the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` environment variables defined in the `docker-compose.yml` file. **Do not commit your actual `.env` file to version control.**

4.  **Start the Database Container:**
    * Make sure Docker Desktop is running.
    * In your project's root directory (where `docker-compose.yml` is located), run:
        ```bash
        docker-compose up -d
        ```
    * This command starts a PostgreSQL container based on your `docker-compose.yml`. It uses the official `postgres` image and creates the database, user, and password specified in the compose file's environment variables. The database will be accessible on `localhost:5432` (or the host port you mapped). You can check if it's running using `docker ps`.
    * **Note:** If port `5432` is already in use on your machine, you can change the `published` port in `docker-compose.yml` (e.g., `published: 5433`) and update `DB_PORT` in your `.env` file accordingly (e.g., `DB_PORT=5433`).

5.  **Run Database Migrations:**
    * TypeORM migrations manage the database schema. Run the following command to apply all pending migrations and create the necessary tables (`movies`, `showtimes`, `bookings`, etc.):
        ```bash
        npm run migration:run
        ```
    * This step must be done *after* the database container is running.

## Running the Application (Development)

* To start the application in development mode with hot-reloading:
    ```bash
    npm run start:dev
    ```
* The application will typically be available at `http://localhost:3000` (or the `PORT` specified in your `.env`).
* The Swagger API documentation should be available at `http://localhost:3000/api` (or your configured path).

## Building the Application (Production)

* To create a production-ready build in the `dist` folder:
    ```bash
    npm run build
    ```
* To run the production build:
    ```bash
    npm run start:prod
    ```

## Running Tests

Make sure your database container (started via `docker-compose up -d`) is running before executing E2E tests. The E2E tests (as currently configured with `synchronize: true` in the test setup) will manage their own schema within the connected test database.

* **Run Unit Tests:**
    ```bash
    npm run test
    ```
  *(This executes files matching `*.spec.ts`)*

* **Run End-to-End (E2E) Tests:**
    ```bash
    npm run test:e2e
    ```
  *(This executes files matching `*.e2e-spec.ts`)*

* **Run Tests with Coverage Report:**
    ```bash
    npm run test:cov
    ```
  *(Generates a coverage report in the `coverage/` directory)*

* **Run Specific Test File:**
    ```bash
    npm run test -- <path/to/your/test.spec.ts>
    # Example: npm run test -- src/modules/movies/movie.service.spec.ts
    ```

## Linting and Formatting (Optional)

* **Lint Check:**
    ```bash
    npm run lint
    ```
* **Apply Formatting Fixes (using Prettier, if configured):**
    ```bash
    npm run format
    ```




## API Contracts

### Movies APIs

* **Get all movies**
    * `GET /movies/all`
    * **Success Response (200 OK):**
        ```json
        [
          {
            "id": 12345,
            "title": "Sample Movie Title 1",
            "genre": "Action",
            "duration": 120,
            "rating": 8.7,
            "releaseYear": 2025
          },
          {
            "id": 67890,
            "title": "Sample Movie Title 2",
            "genre": "Comedy",
            "duration": 90,
            "rating": 7.5,
            "releaseYear": 2024
          }
        ]
        ```
* **Add a movie**
    * `POST /movies`
    * **Request Body:**
        ```json
        {
          "title": "Sample Movie Title",
          "genre": "Action",
          "duration": 120,
          "rating": 8.7,
          "releaseYear": 2025
        }
        ```
    * **Success Response (200 OK):**
        ```json
        {
          "id": 1,
          "title": "Sample Movie Title",
          "genre": "Action",
          "duration": 120,
          "rating": 8.7,
          "releaseYear": 2025
        }
        ```
* **Update a movie**
    * `POST /movies/update/{movieTitle}` (Note: `{movieTitle}` is a URL parameter)
    * **Request Body:**
        ```json
        {
          "title": "Updated Movie Title",
          "genre": "Action",
          "duration": 120,
          "rating": 8.7,
          "releaseYear": 2025
        }
        ```
    * **Success Response (200 OK):** (No specific body defined in contract, likely returns status only or a success message)
* **Delete a movie**
    * `DELETE /movies/{movieTitle}` (Note: `{movieTitle}` is a URL parameter)
    * **Success Response (200 OK):** (No specific body defined)

### Showtimes APIs

* **Get showtime by ID**
    * `GET /showtimes/{showtimeId}` (Note: `{showtimeId}` is a URL parameter)
    * **Success Response (200 OK):**
        ```json
        {
          "id": 1,
          "price": 50.2,
          "movieId": 1,
          "theater": "Sample Theater",
          "startTime": "2025-02-14T11:47:46.125Z",
          "endTime": "2025-02-14T14:47:46.125Z"
        }
        ```
* **Add a showtime**
    * `POST /showtimes`
    * **Request Body:**
        ```json
        {
          "movieId": 1,
          "price": 20.2,
          "theater": "Sample Theater",
          "startTime": "2025-02-14T11:47:46.125Z",
          "endTime": "2025-02-14T14:47:46.125Z"
        }
        ```
    * **Success Response (200 OK):**
        ```json
        {
          "id": 1,
          "price": 20.2,
          "movieId": 1,
          "theater": "Sample Theater",
          "startTime": "2025-02-14T11:47:46.125Z",
          "endTime": "2025-02-14T14:47:46.125Z"
        }
        ```
* **Update a showtime**
    * `POST /showtimes/update/{showtimeId}` (Note: `{showtimeId}` is a URL parameter)
    * **Request Body:**
        ```json
        {
          "movieId": 1,
          "price": 55.0,
          "theater": "Sample Theater Updated",
          "startTime": "2025-02-14T12:00:00.000Z",
          "endTime": "2025-02-14T15:00:00.000Z"
        }
        ```
    * **Success Response (200 OK):** (No specific body defined, likely returns the updated object or status only)
* **Delete a showtime**
    * `DELETE /showtimes/{showtimeId}` (Note: `{showtimeId}` is a URL parameter)
    * **Success Response (200 OK):** (No specific body defined)

### Bookings APIs

* **Book a ticket**
    * `POST /bookings`
    * **Request Body:**
        ```json
        {
          "showtimeId": 1,
          "seatNumber": 15,
          "userId": "84438967-f68f-4fa0-b620-0f08217e76af"
        }
        ```
    * **Success Response (200 OK):**
        ```json
        {
          "bookingId": "d1a6423b-4469-4b00-8c5f-e3cfc42eacae"
        }
        ```

## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (LTS version recommended, e.g., v18 or v20)
* npm (usually comes with Node.js) or yarn
* Docker ([https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/))
* Docker Compose (usually included with Docker Desktop)
