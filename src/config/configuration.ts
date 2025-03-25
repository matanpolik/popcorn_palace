import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'popcorn-palace',
    password: process.env.DB_PASSWORD || 'popcorn-palace',
    name: process.env.DB_NAME || 'popcorn-palace',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true' || true,
    title: process.env.SWAGGER_TITLE || 'Movie Booking API',
    description:
      process.env.SWAGGER_DESCRIPTION ||
      'Movie Booking System API Documentation',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
}));
