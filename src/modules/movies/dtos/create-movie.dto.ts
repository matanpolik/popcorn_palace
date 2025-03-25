import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Sample Movie Title' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({ example: 'Action' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  genre: string;

  @ApiProperty({ example: 120 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 8.7 })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear: number;
}
