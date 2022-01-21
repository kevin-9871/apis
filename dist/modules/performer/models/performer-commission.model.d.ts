import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PerformerCommissionModel extends Document {
    performerId: ObjectId;
    tipCommission: number;
    privateCallCommission: number;
    groupCallCommission: number;
    productCommission: number;
    albumCommission: number;
    videoCommission: number;
    studioCommission: number;
    memberCommission: number;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
