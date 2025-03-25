import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  movieId: number;

  @ApiProperty({ example: 20.2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Sample Theater' })
  @IsNotEmpty()
  @IsString()
  theater: string;

  @ApiProperty({ example: '2025-02-14T11:47:46.125405Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ example: '2025-02-14T14:47:46.125405Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}
