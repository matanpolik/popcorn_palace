// src/movies/dtos/movie-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class MovieResponseDto {
  @ApiProperty({ example: 1 })
  @IsInt() // Important: Include validation, even on response DTOs
  id: number;

  @ApiProperty({ example: 'Sample Movie Title' })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({ example: 'Action' })
  @IsString()
  @Length(1, 100)
  genre: string;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 8.7 })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 2025 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear: number;
}