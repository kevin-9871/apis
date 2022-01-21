import { DataResponse } from 'src/kernel';
import { ConversationDto } from '../dtos';
import { ConversationService } from '../services/conversation.service';
import { ConversationCreatePayload, ConversationSearchPayload } from '../payloads';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    getListOfCurrentUser(query: ConversationSearchPayload, req: any): Promise<DataResponse<ConversationDto[]>>;
    getDetails(conversationId: string, req: any): Promise<DataResponse<any>>;
    findConversation(performerId: string): Promise<DataResponse<any>>;
    getByStream(streamId: string): Promise<DataResponse<any>>;
    create(payload: ConversationCreatePayload, user: any): Promise<DataResponse<ConversationDto>>;
}
