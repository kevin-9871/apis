import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PurchasedItemSearchService } from '../services';
import { PaymentTokenSearchPayload } from '../payloads/purchase-item.search.payload';
import { PurchasedItemDto } from '../dtos';
export declare class PaymentTokenSearchController {
    private readonly purchasedItemSearchService;
    constructor(purchasedItemSearchService: PurchasedItemSearchService);
    adminTranasctions(req: PaymentTokenSearchPayload): Promise<DataResponse<PageableData<PurchasedItemDto>>>;
    userTranasctions(req: PaymentTokenSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PurchasedItemDto>>>;
    getPurchasedVideos(req: PaymentTokenSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PurchasedItemDto>>>;
    getPurchasedGalleries(req: PaymentTokenSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PurchasedItemDto>>>;
    getPurchasedProducts(req: PaymentTokenSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PurchasedItemDto>>>;
}
