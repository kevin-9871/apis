import { UserDto } from 'src/modules/user/dtos';
import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ProductService, GalleryService } from 'src/modules/performer-assets/services';
import { SettingService } from 'src/modules/settings';
import { PerformerService } from 'src/modules/performer/services';
import { VideoModel } from 'src/modules/performer-assets/models';
import { PurchaseItemModel } from 'src/modules/purchased-item/models';
import { ConversationService } from 'src/modules/message/services';
import { PurchaseProductsPayload, SendTipsPayload } from '../payloads';
export declare class PurchaseItemService {
    private readonly PaymentTokenModel;
    private readonly videoModel;
    private readonly queueEventService;
    private readonly productService;
    private readonly performerService;
    private readonly galleryService;
    private readonly settingService;
    private readonly conversationService;
    constructor(PaymentTokenModel: Model<PurchaseItemModel>, videoModel: Model<VideoModel>, queueEventService: QueueEventService, productService: ProductService, performerService: PerformerService, galleryService: GalleryService, settingService: SettingService, conversationService: ConversationService);
    findById(id: string | ObjectId): Promise<PurchaseItemModel>;
    purchaseProduct(id: string | ObjectId, user: UserDto, payload: PurchaseProductsPayload): Promise<PurchaseItemModel>;
    purchaseVideo(id: string | ObjectId, user: UserDto): Promise<PurchaseItemModel>;
    buyPhotoGallery(id: string | ObjectId, user: UserDto): Promise<PurchaseItemModel>;
    sendTips(user: UserDto, performerId: string, payload: SendTipsPayload): Promise<PurchaseItemModel>;
    sendPaidToken(user: UserDto, conversationId: string): Promise<PurchaseItemModel>;
}
