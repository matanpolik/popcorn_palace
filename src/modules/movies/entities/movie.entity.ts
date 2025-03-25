import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/abstracts/base.entity';

@Entity('movies')
export class Movie extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  genre: string;

  @Column()
  duration: number;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column({ name: 'release_year' })
  releaseYear: number;
  // ---------------------------- Optional Add-ons : Improvements ----------------------- //
  // @OneToMany(() => Showtime, (showtime) => showtime.movie)
  // showtimes: Showtime[];
}
