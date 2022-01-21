import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class CategoryModel extends Document {
    type: string;
    title: string;
    slug: string;
    parentId: string | ObjectId;
    description: string;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
