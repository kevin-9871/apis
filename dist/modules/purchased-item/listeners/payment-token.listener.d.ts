import { QueueEvent, QueueEventService } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { PerformerCommissionService, PerformerService } from 'src/modules/performer/services';
import { ObjectId } from 'mongodb';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { SettingService } from 'src/modules/settings/services';
import { StudioService } from 'src/modules/studio/services';
import { ConversationService } from 'src/modules/message/services';
import { PurchasedItemDto } from '../dtos';
export declare class PaymentTokenListener {
    private readonly userService;
    private readonly performerService;
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly settingService;
    private readonly performerCommission;
    private readonly studioService;
    private readonly conversationService;
    constructor(userService: UserService, performerService: PerformerService, queueEventService: QueueEventService, socketUserService: SocketUserService, settingService: SettingService, performerCommission: PerformerCommissionService, studioService: StudioService, conversationService: ConversationService);
    handler(event: QueueEvent): Promise<void>;
    notify(transaction: PurchasedItemDto, netPrice: number): Promise<void>;
    getUser(role: string, id: ObjectId): Promise<any>;
}
