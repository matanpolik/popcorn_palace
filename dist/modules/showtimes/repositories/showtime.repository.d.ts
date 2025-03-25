import { DataSource, Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
export declare class ShowtimeRepository extends Repository<Showtime> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByIdWithRelations(id: number): Promise<Showtime | null>;
    findOverlappingShowtimes(theater: string, startTime: Date, endTime: Date, excludeId?: number): Promise<Showtime[]>;
}
