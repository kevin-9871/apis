import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { UserService } from 'src/modules/user/services';
import { PerformerBlockSettingService, PerformerService } from 'src/modules/performer/services';
import { FavouriteService } from 'src/modules/favourite/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { MessageModel, IRecipient } from '../models';
import { MessageCreatePayload } from '../payloads/message-create.payload';
import { MessageDto } from '../dtos';
import { ConversationService } from './conversation.service';
import { MessageListRequest } from '../payloads/message-list.payload';
export declare class MessageService {
    private readonly performerService;
    private readonly conversationService;
    private readonly messageModel;
    private readonly queueEventService;
    private readonly fileService;
    private readonly userService;
    private readonly favouriteService;
    private readonly performerBlockSettingService;
    constructor(performerService: PerformerService, conversationService: ConversationService, messageModel: Model<MessageModel>, queueEventService: QueueEventService, fileService: FileService, userService: UserService, favouriteService: FavouriteService, performerBlockSettingService: PerformerBlockSettingService);
    createStreamMessageFromConversation(conversationId: string | ObjectId, payload: MessageCreatePayload, sender: IRecipient, req?: any): Promise<MessageDto>;
    createPublicStreamMessageFromConversation(conversationId: string | ObjectId, payload: MessageCreatePayload, sender: IRecipient, user: UserDto | PerformerDto, req?: any): Promise<MessageDto>;
    createPrivateFileMessage(sender: IRecipient, recipient: IRecipient, file: FileDto, payload: MessageCreatePayload, req?: any): Promise<MessageDto>;
    loadMessages(req: MessageListRequest, user: UserDto): Promise<{
        data: MessageDto[];
        total: number;
    }>;
    loadPublicMessages(req: MessageListRequest): Promise<{
        data: MessageDto[];
        total: number;
    }>;
    createPrivateMessageFromConversation(conversationId: string | ObjectId, payload: MessageCreatePayload, sender: IRecipient, req?: any): Promise<MessageDto>;
    sendMessageToAllFollowers(performerId: string | ObjectId, payload: MessageCreatePayload): Promise<boolean>;
    deleteMessage(messageId: string, user: UserDto): Promise<MessageModel>;
    deleteAllMessageInConversation(conversationId: string, user: UserDto): Promise<{
        success: boolean;
    }>;
}
