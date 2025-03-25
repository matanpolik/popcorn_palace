import { BaseEntity } from '../../../core/abstracts/base.entity';
export declare class Showtime extends BaseEntity {
    price: number;
    movieId: number;
    theater: string;
    startTime: Date;
    endTime: Date;
}
