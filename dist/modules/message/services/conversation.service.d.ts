import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService, UserSearchService } from 'src/modules/user/services';
import { PerformerService, PerformerSearchService } from 'src/modules/performer/services';
import { StreamDto } from 'src/modules/stream/dtos';
import { ConversationSearchPayload } from '../payloads';
import { ConversationDto } from '../dtos';
import { ConversationModel, NotificationMessageModel } from '../models';
export interface IRecipient {
    source: string;
    sourceId: ObjectId | string;
}
export declare class ConversationService {
    private readonly conversationModel;
    private readonly userService;
    private readonly userSearchService;
    private readonly performerSearchService;
    private readonly performerService;
    private readonly notiticationMessageModel;
    constructor(conversationModel: Model<ConversationModel>, userService: UserService, userSearchService: UserSearchService, performerSearchService: PerformerSearchService, performerService: PerformerService, notiticationMessageModel: Model<NotificationMessageModel>);
    find(params: any): Promise<ConversationModel[]>;
    findOne(params: any): Promise<ConversationModel>;
    createPrivateConversation(sender: IRecipient, receiver: IRecipient): Promise<ConversationDto>;
    getList(req: ConversationSearchPayload, sender: IRecipient): Promise<any>;
    findById(id: string | ObjectId): Promise<import("mongoose").LeanDocument<ConversationModel>>;
    findByIds(ids: string[] | ObjectId[]): Promise<ConversationModel[]>;
    findDetail(id: string | ObjectId, sender: IRecipient): Promise<ConversationDto>;
    findPerformerPublicConversation(performerId: string | ObjectId): Promise<import("mongoose").LeanDocument<ConversationModel>>;
    createStreamConversation(stream: StreamDto, recipients?: any): Promise<ConversationModel>;
    getPrivateConversationByStreamId(streamId: string | ObjectId): Promise<ConversationDto>;
    addRecipient(conversationId: string | ObjectId, recipient: IRecipient): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    serializeConversation(id: string | ObjectId, type: string): string;
    deserializeConversationId(str: string): string;
}
