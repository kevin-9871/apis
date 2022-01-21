import { Document } from 'mongoose';
export declare class AggregatorCategoryModel extends Document {
    name: string;
    alias: string;
    country: string;
    tags: string[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
