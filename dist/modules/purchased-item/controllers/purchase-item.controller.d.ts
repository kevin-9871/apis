import { DataResponse } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { PurchaseProductsPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { PurchaseItemService } from '../services/purchase-item.service';
export declare class PaymentTokenController {
    private readonly purchaseItemService;
    constructor(purchaseItemService: PurchaseItemService);
    purchaseProduct(user: UserDto, productId: string | ObjectId, payload: PurchaseProductsPayload): Promise<DataResponse<any>>;
    purchaseVideo(user: UserDto, videoId: string | ObjectId): Promise<DataResponse<any>>;
    buyPhoto(user: UserDto, id: string): Promise<DataResponse<any>>;
}
