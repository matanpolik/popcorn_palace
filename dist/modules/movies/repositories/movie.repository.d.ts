import { DataSource, Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
export declare class MovieRepository extends Repository<Movie> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findByTitle(title: string): Promise<Movie>;
    findAllWithPagination(page?: number, limit?: number): Promise<[Movie[], number]>;
}
