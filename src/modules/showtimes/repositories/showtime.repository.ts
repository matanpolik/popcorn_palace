import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';

@Injectable()
export class ShowtimeRepository extends Repository<Showtime> {
  constructor(private dataSource: DataSource) {
    super(Showtime, dataSource.createEntityManager());
  }

  async findByIdWithRelations(id: number): Promise<Showtime | null> {
    return this.findOne({
      where: { id },
    });
  }

  async findOverlappingShowtimes(
    theater: string,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<Showtime[]> {
    const query = this.createQueryBuilder('showtime')
      .where('showtime.theater = :theater', { theater })
      .andWhere(
        '((showtime.start_time <= :endTime) AND (showtime.end_time >= :startTime))',
        { startTime, endTime },
      );

    if (excludeId) {
      query.andWhere('showtime.id != :excludeId', { excludeId });
    }

    return query.getMany();
  }
}
