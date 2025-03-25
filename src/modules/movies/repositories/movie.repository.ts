import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private readonly dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async findByTitle(title: string): Promise<Movie> {
    return this.findOne({ where: { title } });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<[Movie[], number]> {
    return this.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'ASC',
      },
    });
  }
}
