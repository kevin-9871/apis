import { QueueEventService } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { StreamService } from 'src/modules/stream/services';
import { ConversationService } from '../services';
export declare class StreamMessageListener {
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly conversationService;
    private readonly performerService;
    private readonly streamService;
    private readonly logger;
    constructor(queueEventService: QueueEventService, socketUserService: SocketUserService, conversationService: ConversationService, performerService: PerformerService, streamService: StreamService);
    private handleMessage;
    private handleNotify;
    private handleNotifyDelete;
    private handleConversation;
}
