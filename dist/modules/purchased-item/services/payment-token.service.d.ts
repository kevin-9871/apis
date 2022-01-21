import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { ObjectId } from 'mongodb';
import { PurchaseItemModel } from '../models/purchase-item.model';
import { PurchaseItemType } from '../constants';
export declare class PaymentTokenService {
    private readonly PaymentTokenModel;
    constructor(PaymentTokenModel: Model<PurchaseItemModel>);
    checkBoughtVideo(id: string | ObjectId, user: UserDto): Promise<boolean>;
    checkBought(id: string | ObjectId, type: PurchaseItemType, user: UserDto): Promise<boolean>;
    findByQuery(query: any): Promise<PurchaseItemModel[]>;
}
