import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PostModel extends Document {
    authorId?: ObjectId;
    type: string;
    title?: string;
    slug?: string;
    content?: string;
    shortDescription?: string;
    categoryIds?: string[];
    categorySearchIds?: string[];
    status: string;
    image?: string;
    updatedBy?: ObjectId;
    createdBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
