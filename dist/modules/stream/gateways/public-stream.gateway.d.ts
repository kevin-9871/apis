import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services';
import { StreamService } from 'src/modules/stream/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { ConversationService } from 'src/modules/message/services';
import { StreamModel } from '../models';
export declare class PublicStreamWsGateway {
    private readonly streamModel;
    private readonly authService;
    private readonly streamService;
    private readonly socketService;
    private readonly userService;
    private readonly performerService;
    private readonly conversationService;
    constructor(streamModel: Model<StreamModel>, authService: AuthService, streamService: StreamService, socketService: SocketUserService, userService: UserService, performerService: PerformerService, conversationService: ConversationService);
    goLive(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleJoinPublicRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleReJoinPublicRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleLeavePublicRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
}
