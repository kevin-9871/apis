import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export declare class ForgotModel extends Document {
    authId: ObjectId;
    sourceId: ObjectId;
    source: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
