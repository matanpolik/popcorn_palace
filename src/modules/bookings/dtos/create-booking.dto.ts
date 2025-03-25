import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  showtimeId: number;

  @ApiProperty({ example: 15 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seatNumber: number;

  @ApiProperty({ example: '84438967-f68f-4fa0-b620-0f08217e76af' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
