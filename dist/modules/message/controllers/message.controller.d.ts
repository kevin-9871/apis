import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { MessageService, NotificationMessageService } from '../services';
import { MessageListRequest, NotificationMessageReadPayload, MessageCreatePayload, PrivateMessageCreatePayload } from '../payloads';
import { MessageDto } from '../dtos';
export declare class MessageController {
    private readonly messageService;
    private readonly notificationMessageService;
    constructor(messageService: MessageService, notificationMessageService: NotificationMessageService);
    createPrivateFileMessage(files: Record<string, any>, payload: PrivateMessageCreatePayload, req: any): Promise<DataResponse<MessageDto>>;
    readAllMessage(payload: NotificationMessageReadPayload, req: any): Promise<DataResponse<MessageDto>>;
    countTotalNotReadMessage(user: UserDto): Promise<DataResponse<any>>;
    loadMessages(req: MessageListRequest, conversationId: string, user: UserDto): Promise<DataResponse<any>>;
    loadPublicMessages(req: MessageListRequest, conversationId: string): Promise<DataResponse<any>>;
    createMessage(payload: MessageCreatePayload, conversationId: string, req: any): Promise<DataResponse<any>>;
    createStreamMessage(payload: MessageCreatePayload, conversationId: string, req: any): Promise<DataResponse<any>>;
    createPublicStreamMessage(payload: MessageCreatePayload, conversationId: string, req: any, user: UserDto): Promise<DataResponse<any>>;
    deletePublicMessage(messageId: string, user: UserDto): Promise<DataResponse<any>>;
    deleteAllPublicMessage(conversationId: string, user: UserDto): Promise<DataResponse<any>>;
    sendMessageToAllFollowers(payload: MessageCreatePayload, performer: PerformerDto): Promise<DataResponse<{
        success: boolean;
    }>>;
}
