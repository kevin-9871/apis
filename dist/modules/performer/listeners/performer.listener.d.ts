import { Model } from 'mongoose';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { StudioService } from 'src/modules/studio/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { ConversationService } from 'src/modules/message/services';
import { PerformerCommissionModel } from '../models';
import { PerformerCommissionService, PerformerService } from '../services';
export declare class PerformerListener {
    private readonly PerformerCommission;
    private readonly queueEventService;
    private readonly performerCommsionService;
    private readonly settingService;
    private readonly studioService;
    private readonly performerService;
    private readonly socketUserService;
    private readonly conversationService;
    constructor(PerformerCommission: Model<PerformerCommissionModel>, queueEventService: QueueEventService, performerCommsionService: PerformerCommissionService, settingService: SettingService, studioService: StudioService, performerService: PerformerService, socketUserService: SocketUserService, conversationService: ConversationService);
    private studioUpdatedHandler;
    performerStreamStatusHandler(event: QueueEvent): Promise<void>;
}
