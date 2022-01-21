import { DataResponse, PageableData } from 'src/kernel';
import { TokenPackageService, TokenPackageSearchService } from '../services';
import { TokenPackageCreatePayload, TokenPackageSearchPayload, TokenPackageUpdatePayload } from '../payloads';
import { ITokenPackage } from '../dtos';
export declare class AdminTokenPackageController {
    private readonly tokenPackageService;
    private readonly tokenPackageSearchService;
    constructor(tokenPackageService: TokenPackageService, tokenPackageSearchService: TokenPackageSearchService);
    create(payload: TokenPackageCreatePayload): Promise<DataResponse<ITokenPackage>>;
    update(payload: TokenPackageUpdatePayload, id: string): Promise<DataResponse<ITokenPackage>>;
    details(id: string): Promise<DataResponse<ITokenPackage>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    adminSearch(req: TokenPackageSearchPayload): Promise<DataResponse<PageableData<ITokenPackage>>>;
}
