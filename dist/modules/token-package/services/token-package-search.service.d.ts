import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { TokenPackageModel } from '../models';
import { TokenPackageSearchPayload } from '../payloads';
export declare class TokenPackageSearchService {
    private readonly tokenPackageModel;
    constructor(tokenPackageModel: Model<TokenPackageModel>);
    search(req: TokenPackageSearchPayload): Promise<PageableData<TokenPackageModel>>;
    userSearch(req: TokenPackageSearchPayload): Promise<PageableData<TokenPackageModel>>;
}
