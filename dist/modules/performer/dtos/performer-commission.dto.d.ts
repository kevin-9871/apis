import { ObjectId } from 'mongodb';
export interface ICommissionSetting {
    _id?: ObjectId;
    performerId: ObjectId;
    tipCommission: number;
    privateCallCommission: number;
    groupCallCommission: number;
    productCommission: number;
    albumCommission: number;
    videoCommission: number;
    studioCommission: number;
    memberCommission: number;
}
export declare class PerformerCommissionDto {
    _id: ObjectId;
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
    constructor(data?: Partial<PerformerCommissionDto>);
}
