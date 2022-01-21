import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export interface IRefItem {
    itemType: string;
    itemId: ObjectId;
}
export declare class FileModel extends Document {
    type?: string;
    name?: string;
    description?: string;
    mimeType?: string;
    server?: string;
    path?: string;
    absolutePath?: string;
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    status?: string;
    thumbnails?: any;
    encoding?: string;
    refItems?: IRefItem[];
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
