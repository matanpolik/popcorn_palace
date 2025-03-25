import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/abstracts/base.entity';

@Entity('showtimes')
export class Showtime extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ length: 255 })
  theater: string;

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date;
  // ---------------------------- Optional Add-ons : Improvements ----------------------- //
  // @ManyToOne(() => Movie)
  // @JoinColumn({ name: 'movie_id' })
  // movie: Movie;
  //
  // @OneToMany(() => Booking, (booking) => booking.showtime)
  // bookings: Booking[];
}
