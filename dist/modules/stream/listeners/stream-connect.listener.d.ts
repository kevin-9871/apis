import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { ConversationService } from 'src/modules/message/services';
import { StreamModel } from '../models';
import { StreamService } from '../services';
export declare class StreamConnectListener {
    private readonly queueEventService;
    private readonly userService;
    private readonly performerService;
    private readonly socketUserService;
    private readonly streamService;
    private readonly conversationService;
    private readonly streamModel;
    constructor(queueEventService: QueueEventService, userService: UserService, performerService: PerformerService, socketUserService: SocketUserService, streamService: StreamService, conversationService: ConversationService, streamModel: Model<StreamModel>);
    leftRoom(conversation: any, username: string, isMember?: boolean): Promise<[void, void]>;
    userDisconnectHandler(event: QueueEvent): Promise<void>;
    modelDisconnectHandler(event: QueueEvent): Promise<void>;
}
