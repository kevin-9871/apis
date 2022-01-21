import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PostMetaModel extends Document {
    postId?: ObjectId;
    key?: any;
    value?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
