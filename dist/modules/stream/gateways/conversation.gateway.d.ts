import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { RequestService } from 'src/modules/stream/services';
import { AuthService } from 'src/modules/auth/services';
import { ConversationService } from 'src/modules/message/services';
import { Socket } from 'socket.io';
import { Model } from 'mongoose';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { StreamModel } from '../models';
export declare class StreamConversationWsGateway {
    private readonly socketUserService;
    private readonly authService;
    private readonly conversationService;
    private readonly userService;
    private readonly performerService;
    private readonly requestService;
    private readonly streamModel;
    constructor(socketUserService: SocketUserService, authService: AuthService, conversationService: ConversationService, userService: UserService, performerService: PerformerService, requestService: RequestService, streamModel: Model<StreamModel>);
    handleJoinPrivateRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleReJoinPrivateRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleLeavePrivateRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
}
