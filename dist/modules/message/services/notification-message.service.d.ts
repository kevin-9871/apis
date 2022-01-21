import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { ConversationService } from './conversation.service';
import { NotificationMessageModel } from '../models';
export declare class NotificationMessageService {
    private readonly notificationMessageModel;
    private readonly conversationService;
    private readonly socketUserService;
    constructor(notificationMessageModel: Model<NotificationMessageModel>, conversationService: ConversationService, socketUserService: SocketUserService);
    recipientReadAllMessageInConversation(recipientId: string | ObjectId, conversationId: string | ObjectId): Promise<any>;
    countTotalNotReadMessage(user: UserDto): Promise<any>;
}
