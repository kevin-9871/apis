import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class FavouriteModel extends Document {
    favoriteId: ObjectId;
    ownerId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
