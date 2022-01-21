import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { UserModel } from '../models';
export declare class UserConnectedListener {
    private readonly queueEventService;
    private readonly userModel;
    constructor(queueEventService: QueueEventService, userModel: Model<UserModel>);
    private handleOnlineOffline;
}
