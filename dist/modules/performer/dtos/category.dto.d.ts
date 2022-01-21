import { ObjectId } from 'mongodb';
export declare class PerformerCategoryDto {
    _id: ObjectId;
    name: string;
    slug: string;
    ordering: number;
    description: string;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PerformerCategoryDto>);
}
