import { QueueEventService } from 'src/kernel';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
export declare class BlockUserListener {
    private readonly queueEventService;
    private readonly socketUserService;
    constructor(queueEventService: QueueEventService, socketUserService: SocketUserService);
    private handleMessage;
}
