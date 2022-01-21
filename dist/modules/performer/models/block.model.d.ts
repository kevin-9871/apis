import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class BlockSettingModel extends Document {
    performerId: ObjectId;
    countries: string[];
    userIds: ObjectId[] | string[];
    createdAt: Date;
    updatedAt: Date;
}
