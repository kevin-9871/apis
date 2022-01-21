import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export declare class AuthModel extends Document {
    source?: string;
    sourceId?: ObjectId;
    type?: string;
    key?: string;
    value?: string;
    salt?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
