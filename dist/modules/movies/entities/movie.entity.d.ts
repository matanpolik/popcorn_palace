import { BaseEntity } from '../../../core/abstracts/base.entity';
export declare class Movie extends BaseEntity {
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
}
