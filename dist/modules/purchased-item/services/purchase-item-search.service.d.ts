import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { Model } from 'mongoose';
import { PhotoModel, VideoModel } from 'src/modules/performer-assets/models';
import { GalleryService } from 'src/modules/performer-assets/services';
import { PurchaseItemModel } from '../models';
import { PaymentTokenSearchPayload } from '../payloads';
import { PurchasedItemDto } from '../dtos';
export declare class PurchasedItemSearchService {
    private readonly fileService;
    private readonly performerService;
    private readonly PaymentTokenModel;
    private readonly userService;
    private readonly videoModel;
    private readonly PhotoModel;
    private readonly galleryService;
    constructor(fileService: FileService, performerService: PerformerService, PaymentTokenModel: Model<PurchaseItemModel>, userService: UserService, videoModel: Model<VideoModel>, PhotoModel: Model<PhotoModel>, galleryService: GalleryService);
    getUserTransactionsToken(req: PaymentTokenSearchPayload, user: UserDto): Promise<{
        total: number;
        data: PurchasedItemDto[];
    }>;
    adminGetUserTransactionsToken(req: PaymentTokenSearchPayload): Promise<{
        total: number;
        data: PurchasedItemDto[];
    }>;
    userSearchPurchasedItem(query: any, sort: any, req: any): Promise<{
        total: number;
        data: PurchasedItemDto[];
    }>;
    private _mapVideoInfo;
    private _mapGalleryInfo;
}
