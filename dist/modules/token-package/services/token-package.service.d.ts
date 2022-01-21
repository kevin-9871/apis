import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { TokenPackageModel } from '../models';
import { TokenPackageCreatePayload, TokenPackageUpdatePayload } from '../payloads';
import { TokenPackageDto } from '../dtos';
export declare class TokenPackageService {
    private readonly tokenPackageModel;
    constructor(tokenPackageModel: Model<TokenPackageModel>);
    find(params: any): Promise<TokenPackageModel[]>;
    findById(id: string | ObjectId): Promise<TokenPackageModel>;
    create(payload: TokenPackageCreatePayload): Promise<TokenPackageModel>;
    update(id: string | ObjectId, payload: TokenPackageUpdatePayload): Promise<TokenPackageModel>;
    delete(id: string | ObjectId): Promise<boolean>;
    getPublic(id: string): Promise<TokenPackageDto>;
}
