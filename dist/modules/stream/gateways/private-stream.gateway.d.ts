import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { AuthService } from 'src/modules/auth/services';
import { Socket } from 'socket.io';
import { Model } from 'mongoose';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { ConversationService } from 'src/modules/message/services';
import { StreamModel } from '../models';
import { RequestService } from '../services';
export declare class PrivateStreamWsGateway {
    private readonly socketUserService;
    private readonly streamModel;
    private readonly authService;
    private readonly userService;
    private readonly performerService;
    private readonly requestService;
    private readonly conversationService;
    constructor(socketUserService: SocketUserService, streamModel: Model<StreamModel>, authService: AuthService, userService: UserService, performerService: PerformerService, requestService: RequestService, conversationService: ConversationService);
    handleJoinStream(client: Socket, payload: {
        conversationId: string;
        streamId: string;
    }): Promise<void>;
    handleLeaveStream(client: Socket, payload: {
        conversationId: string;
        streamId: string;
    }): Promise<void>;
}
