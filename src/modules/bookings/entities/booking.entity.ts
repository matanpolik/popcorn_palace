import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column({ name: 'showtime_id' })
  showtimeId: number;

  @Column()
  seatNumber: number;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
}
