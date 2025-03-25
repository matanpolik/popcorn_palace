import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({ example: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae' })
  bookingId: string;
}
