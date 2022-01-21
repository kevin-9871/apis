import { DataResponse, PageableData } from 'src/kernel';
import { TokenPackageService, TokenPackageSearchService } from '../services';
import { ITokenPackage } from '../dtos';
import { TokenPackageSearchPayload } from '../payloads';
export declare class TokenPackageController {
    private readonly tokenPackageService;
    private readonly tokenPackageSearchService;
    constructor(tokenPackageService: TokenPackageService, tokenPackageSearchService: TokenPackageSearchService);
    search(req: TokenPackageSearchPayload): Promise<DataResponse<PageableData<ITokenPackage>>>;
}
