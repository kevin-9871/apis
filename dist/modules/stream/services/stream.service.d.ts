import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ConversationService } from 'src/modules/message/services';
import { QueueEventService } from 'src/kernel/infras/queue';
import { UserDto } from 'src/modules/user/dtos';
import { RequestService } from './request.service';
import { SocketUserService } from '../../socket/services/socket-user.service';
import { Webhook, StreamDto } from '../dtos';
import { StreamModel } from '../models';
import { TokenCreatePayload } from '../payloads';
export declare class StreamService {
    private readonly performerService;
    private readonly streamModel;
    private readonly conversationService;
    private readonly socketUserService;
    private readonly requestService;
    private readonly queueEventService;
    constructor(performerService: PerformerService, streamModel: Model<StreamModel>, conversationService: ConversationService, socketUserService: SocketUserService, requestService: RequestService, queueEventService: QueueEventService);
    findById(id: string | ObjectId): Promise<StreamModel>;
    findBySessionId(sessionId: string): Promise<StreamModel>;
    findByPerformerId(performerId: string | ObjectId, payload?: Partial<StreamDto>): Promise<StreamModel>;
    getSessionId(performerId: string | ObjectId, type: string): Promise<string>;
    create(payload: {
        sessionId: string;
        performerId: string | ObjectId;
        type: string;
    }): Promise<StreamModel>;
    goLive(performerId: ObjectId): Promise<{
        conversation: import("../../message/models").ConversationModel;
        sessionId: any;
    }>;
    joinPublicChat(performerId: string | ObjectId): Promise<{
        sessionId: any;
    }>;
    requestPrivateChat(user: UserDto, performerId: string | ObjectId): Promise<{
        conversation: import("../../message/models").ConversationModel;
        sessionId: string;
    }>;
    accpetPrivateChat(id: string, performerId: ObjectId): Promise<{
        conversation: import("mongoose").LeanDocument<import("../../message/models").ConversationModel>;
        sessionId: string;
    }>;
    startGroupChat(performerId: ObjectId): Promise<{
        conversation: import("../../message/models").ConversationModel;
        sessionId: string;
    }>;
    joinGroupChat(performerId: string, user: UserDto): Promise<{
        conversation: import("../../message/models").ConversationModel;
        sessionId: string;
    }>;
    webhook(sessionId: string, payload: Webhook): Promise<StreamModel>;
    getOneTimeToken(payload: TokenCreatePayload, userId: string): Promise<any>;
}
