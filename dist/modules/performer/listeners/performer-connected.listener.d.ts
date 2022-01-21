import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerModel } from '../models';
export declare class PerformerConnectedListener {
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly performerModel;
    constructor(queueEventService: QueueEventService, socketUserService: SocketUserService, performerModel: Model<PerformerModel>);
    private handleOnlineOffline;
}
